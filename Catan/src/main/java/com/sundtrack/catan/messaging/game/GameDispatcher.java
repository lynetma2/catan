package com.sundtrack.catan.messaging.game;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.EndSummaryAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.error.GameErrorEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.EndSummaryEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.turn.TurnEndEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.turn.TurnStartEvent;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.GameRuleException;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.ValidationErrorCode;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.datalayer.domain.game.PlayerStats;
import com.sundtrack.catan.datalayer.domain.game.PlayerStatsDiff;
import com.sundtrack.catan.datalayer.dto.snapshot.EndSummaryDTO;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.interfaces.ActiveGameRegistry;
import com.sundtrack.catan.session.game.services.interfaces.GameArchive;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GameDispatcher {

    private static final Logger log = LoggerFactory.getLogger(GameDispatcher.class);

    private final GameHandlerRegistry registry;
    private final ActiveGameRegistry activeGames;
    private final GameArchive gameArchive;

    public GameDispatcher(GameHandlerRegistry registry, ActiveGameRegistry activeGames, GameArchive gameArchive) {
        this.registry = registry;
        this.activeGames = activeGames;
        this.gameArchive = gameArchive;
    }

    public EventResult<ServerEvent> dispatch(GameContext context, ClientAction action) {
        try {
            return doDispatch(context, action);
        } catch (GameRuleException e) {
            log.info("Game action rejected: {} ({})", e.code(), e.getMessage());
            return errorResult(context, e.code(), e.getMessage(), e.details());
        } catch (Exception e) {
            log.error("Unexpected error handling {} for game {}",
                    action.getClass().getSimpleName(), context.gameId(), e);
            return errorResult(context, ValidationErrorCode.INTERNAL_ERROR,
                    "Something went wrong processing your action", Map.of());
        }
    }

    @SuppressWarnings("unchecked")
    private EventResult<ServerEvent> doDispatch(GameContext context, ClientAction action) {
        Optional<Game> active = activeGames.findActive(context.gameId());

        if (active.isEmpty()) {
            return dispatchFinished(context, action);
        }

        GameActionHandler<ClientAction> handler =
                (GameActionHandler<ClientAction>) registry.get(action.getClass());
        if (handler == null) {
            throw new IllegalArgumentException(
                    "No handler registered for " + action.getClass().getSimpleName());
        }

        Game game = active.get();
        DispatchSnapshot before = DispatchSnapshot.capture(game);

        EventResult<ServerEvent> result = handler.handle(context, game, action);

        EventResult<ServerEvent> withCrossCutting = mergeCrossCuttingEvents(game, before, result);
        EventResult<ServerEvent> finalResult = mergeEndOfActionEvents(game, withCrossCutting);

        game.recordEvent(action, finalResult, context);
        return finalResult;
    }

    private EventResult<ServerEvent> errorResult(GameContext context, ValidationErrorCode code,
                                                 String message, Map<String, Object> details) {
        GameErrorEvent error = new GameErrorEvent(code.toString(), message, details);
        return EventResult.of(List.of(), Map.of(context.playerId(), List.of(error)));
    }

    private EventResult<ServerEvent> dispatchFinished(GameContext context, ClientAction action) {
        if (action instanceof EndSummaryAction) {
            EndSummaryDTO summary = gameArchive.findEndSummary(context.gameId())
                    .orElseThrow(() -> new IllegalStateException("Unknown game: " + context.gameId()));
            return EventResult.directed(context.playerId(), new EndSummaryEvent(summary));
        }

        // Finished games only support historical reads — never mutations.
        throw new IllegalStateException("Game is finished: " + context.gameId());
    }

    private EventResult<ServerEvent> mergeCrossCuttingEvents(Game game, DispatchSnapshot before,
                                                             EventResult<ServerEvent> result) {
        List<ServerEvent> events = new ArrayList<>();

        GamePhase phaseAfter = game.getCurrentPhase();
        if (!before.phase().equals(phaseAfter)) {
            events.add(new GamePhaseChangedEvent(phaseAfter));
        }

        UUID playerAfter = game.getCurrentPlayerId();
        if (!before.currentPlayerId().equals(playerAfter)) {
            events.add(new TurnEndEvent(before.currentPlayerId()));
            events.add(new TurnStartEvent(playerAfter, game.getTurnNumber()));
        }

        Map<UUID, PlayerStats> statsAfter = PlayerStatsDiff.capture(game);
        events.addAll(PlayerStatsDiff.diff(before.stats(), statsAfter));

        return events.isEmpty() ? result : result.merge(EventResult.broadcast(events));
    }

    private EventResult<ServerEvent> mergeEndOfActionEvents(Game game, EventResult<ServerEvent> result) {
        return game.evaluateEndOfAction()
                .map(EventResult::broadcast)
                .map(result::merge)
                .orElse(result);
    }

    private record DispatchSnapshot(GamePhase phase, UUID currentPlayerId, Map<UUID, PlayerStats> stats) {
        static DispatchSnapshot capture(Game game) {
            return new DispatchSnapshot(game.getCurrentPhase(), game.getCurrentPlayerId(), PlayerStatsDiff.capture(game));
        }
    }
}