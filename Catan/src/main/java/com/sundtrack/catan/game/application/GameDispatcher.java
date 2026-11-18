package com.sundtrack.catan.game.application;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.event.action.EndSummaryAction;
import com.sundtrack.catan.game.domain.event.server.error.GameErrorEvent;
import com.sundtrack.catan.game.domain.event.server.state.EndSummaryEvent;
import com.sundtrack.catan.game.domain.event.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.game.domain.event.server.turn.TurnEndEvent;
import com.sundtrack.catan.game.domain.event.server.turn.TurnStartEvent;
import com.sundtrack.catan.game.domain.exceptions.validation.GameRuleException;
import com.sundtrack.catan.game.domain.exceptions.validation.ValidationErrorCode;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.domain.GamePhase;
import com.sundtrack.catan.game.domain.PlayerStats;
import com.sundtrack.catan.game.domain.PlayerStatsDiff;
import com.sundtrack.catan.game.dto.snapshot.EndSummaryDTO;
import com.sundtrack.catan.game.application.handler.GameActionHandler;
import com.sundtrack.catan.game.application.port.GameQueryPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GameDispatcher {

    private static final Logger log = LoggerFactory.getLogger(GameDispatcher.class);

    private final GameHandlerRegistry registry;
    private final GameQueryPort gameQuery;

    public GameDispatcher(GameHandlerRegistry registry, GameQueryPort gameQuery) {
        this.registry = registry;
        this.gameQuery = gameQuery;
    }

    /** Active-game path: the caller already loaded the Game, so we don't re-load it here. */
    public EventResult<ServerEvent> dispatch(GameContext context, Game game, ClientAction action) {
        try {
            return doDispatch(context, game, action);
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

    /** Finished-game path: historical reads only, never mutations. */
    public EventResult<ServerEvent> dispatchFinished(GameContext context, ClientAction action) {
        if (action instanceof EndSummaryAction) {
            EndSummaryDTO summary = gameQuery.findEndSummary(context.gameId())
                    .orElseThrow(() -> new IllegalStateException("Unknown game: " + context.gameId()));
            return EventResult.directed(context.playerId(), new EndSummaryEvent(summary));
        }
        throw new IllegalStateException("Game is finished: " + context.gameId());
    }

    @SuppressWarnings("unchecked")
    private EventResult<ServerEvent> doDispatch(GameContext context, Game game, ClientAction action) {
        GameActionHandler<ClientAction> handler =
                (GameActionHandler<ClientAction>) registry.get(action.getClass());
        if (handler == null) {
            throw new IllegalArgumentException(
                    "No handler registered for " + action.getClass().getSimpleName());
        }

        DispatchSnapshot before = DispatchSnapshot.capture(game);

        EventResult<ServerEvent> result = handler.handle(context, game, action);

        EventResult<ServerEvent> withCrossCutting = mergeCrossCuttingEvents(game, before, result);
        EventResult<ServerEvent> finalResult = mergeEndOfActionEvents(game, withCrossCutting);

        game.recordEvent(action, finalResult, context.playerId());
        return finalResult;
    }

    private EventResult<ServerEvent> errorResult(GameContext context, ValidationErrorCode code,
                                                 String message, Map<String, Object> details) {
        GameErrorEvent error = new GameErrorEvent(code.toString(), message, details);
        return EventResult.of(List.of(), Map.of(context.playerId(), List.of(error)));
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