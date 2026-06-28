package com.sundtrack.catan.session.game.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.RollDiceAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.RollDiceEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceGrantEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.dto.snapshot.DiceRollDTO;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.*;

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
        //Generate the new dice values
        DiceRollDTO diceRoll = game.rollDices();
        GamePhase gamePhase;
        Map<UUID, List<Resource>> addedResources;

        //Handle the possible branching
        if (diceRoll.isSeven()) {
            // If 7 update gamePhase to introduce the robber flow.
            gamePhase = game.advancePhaseAfterSevenRoll();
            addedResources = new HashMap<>();
        } else {
            // Otherwise create grant events and update the gamePhase to post flow.
            addedResources = game.grantResourcesForRoll(diceRoll.total());
            gamePhase = game.advancePhaseAfterGrantResources();
        }

        return new MutationResult(gamePhase, addedResources, diceRoll);
    }

    private EventResult<ServerEvent> createResults(GameContext context, MutationResult result) {
        List<ServerEvent> serverEvents = new ArrayList<>();

        //New Phase event.
        serverEvents.add(new GamePhaseChangedEvent(result.gamePhase));
        serverEvents.add(new RollDiceEvent(result.diceRoll.toList()));

        //Granted resources is public knowledge hence broadcast.
        result.resources.forEach((uuid, resources) -> {
            serverEvents.add(new ResourceGrantEvent(uuid, resources));
        });

        return EventResult.of(serverEvents, Map.of());
    }

    private record MutationResult(GamePhase gamePhase, Map<UUID, List<Resource>> resources, DiceRollDTO diceRoll) {
    }
}
