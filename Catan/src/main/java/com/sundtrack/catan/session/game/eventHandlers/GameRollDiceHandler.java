package com.sundtrack.catan.session.game.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.RollDiceAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.dto.snapshot.DiceRollDTO;
import com.sundtrack.catan.messaging.HandlesEvent;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@HandlesEvent(RollDiceAction.class)
public class GameRollDiceHandler implements GameActionHandler<RollDiceAction> {

    @Override
    public EventResult<ServerEvent> handle(GameContext context, RollDiceAction action) {
        return null;
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
            // Otherwise create grant events and update the gamephase to post flow.
            addedResources = game.grantResourcesForRoll(diceRoll.total());
            gamePhase = game.advancePhaseAfterGrantResources();
        }

        return new MutationResult(gamePhase, addedResources);
    }

    private void createResults(GameContext context, MutationResult result) {
        List<ServerEvent> serverEvents = new ArrayList<>();

        //New Phase event.
        serverEvents.add(new GamePhaseChangedEvent(result.gamePhase));

        //Granted resources directed.
        Map<UUID, ServerEvent> serverEventMap = new HashMap<>();

        //Granted resources broadcast.

    }

    private record MutationResult(GamePhase gamePhase, Map<UUID, List<Resource>> resources) {
    }
}
