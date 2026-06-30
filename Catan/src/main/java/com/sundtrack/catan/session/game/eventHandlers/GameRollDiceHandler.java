package com.sundtrack.catan.session.game.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.RollDiceAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.RollDiceEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.DiscardRequiredEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceGrantEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.datalayer.domain.game.DiscardSession;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.dto.snapshot.DiceRollDTO;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@HandlesEvent(RollDiceAction.class)
public class GameRollDiceHandler implements GameActionHandler<RollDiceAction> {

    private final GameStore gameStore;

    public GameRollDiceHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, RollDiceAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        MutationResult result = doMutations(game, context);
        EventResult<ServerEvent> events = createResults(context, result);

        game.recordEvent(action, events, context);
        //gameStore.save(game);

        return events;
    }

    private void doValidations(Game game, GameContext context, RollDiceAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private MutationResult doMutations(Game game, GameContext context) {
        DiceRollDTO diceRoll = game.rollDices();
        return diceRoll.isSeven()
                ? handleSevenRoll(game, diceRoll)
                : handleNormalRoll(game, diceRoll);
    }

    private MutationResult handleSevenRoll(Game game, DiceRollDTO diceRoll) {
        Game.SevenRolledAdvanceResult result = game.advancePhaseAfterSevenRoll();
        return new MutationResult(result.gamephase(), Collections.emptyMap(), diceRoll, result.discardSession());
    }

    private MutationResult handleNormalRoll(Game game, DiceRollDTO diceRoll) {
        Map<UUID, List<Resource>> addedResources = game.grantResourcesForRoll(diceRoll.total());
        return new MutationResult(game.advancePhaseAfterGrantResources(), addedResources, diceRoll, Optional.empty());
    }

    private EventResult<ServerEvent> createResults(GameContext context, MutationResult result) {
        List<ServerEvent> events = new ArrayList<>();
        events.add(createPhaseChangedEvent(result));
        events.add(createRollDiceEvent(result));
        events.addAll(createResourceGrantEvents(result));
        events.addAll(createDiscardRequiredEvents(result));
        return EventResult.of(events, Map.of());
    }

    private ServerEvent createPhaseChangedEvent(MutationResult result) {
        return new GamePhaseChangedEvent(result.gamePhase);
    }

    private ServerEvent createRollDiceEvent(MutationResult result) {
        return new RollDiceEvent(result.diceRoll);
    }

    private List<ServerEvent> createResourceGrantEvents(MutationResult result) {
        return result.resources.entrySet().stream()
                .map(entry ->
                        new ResourceGrantEvent(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    private List<ServerEvent> createDiscardRequiredEvents(MutationResult result) {
        List<ServerEvent> discardEvents = new ArrayList<>();
        result.discardSession.ifPresent(session ->
                session.getRequiredDiscards().forEach((playerId, amount) ->
                        discardEvents.add(new DiscardRequiredEvent(playerId, amount))
                )
        );
        return discardEvents;
    }

    private record MutationResult(GamePhase gamePhase, Map<UUID, List<Resource>> resources, DiceRollDTO diceRoll,
                                  Optional<DiscardSession> discardSession) {
    }
}
