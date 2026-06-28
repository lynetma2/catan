package com.sundtrack.catan.session.game.eventHandlers.robber;

import com.sundtrack.catan.datalayer.domain.board.Hex;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.robber.PlaceRobberAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.robber.RobberPlaceEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GamePhaseChangedEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(PlaceRobberAction.class)
public class GamePlaceRobberHandler implements GameActionHandler<PlaceRobberAction> {
    private final GameStore gameStore;

    public GamePlaceRobberHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, PlaceRobberAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        MutationResult result = doMutations(game, context, action);
        EventResult<ServerEvent> events = createResults(context, result);

        game.recordEvent(action, events, context);
        //gameStore.save(game);

        return events;
    }

    private void doValidations(Game game, GameContext context, PlaceRobberAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
        game.validateBoardRobber(action.target());
    }

    private MutationResult doMutations(Game game, GameContext context, PlaceRobberAction action) {
        //Update the position of the robber. (Set to false in old hex and true in new)
        game.moveRobber(action.target());
        //Update game phase to stealing or post roll.
        GamePhase newPhase = game.advancePhaseAfterRobberPlacement(context.playerId());

        return new MutationResult(action.target(), newPhase);
    }

    private EventResult<ServerEvent> createResults(GameContext context, MutationResult result) {
        List<ServerEvent> serverEvents = new ArrayList<>();
        serverEvents.add(new RobberPlaceEvent(result.robbedHex));
        serverEvents.add(new GamePhaseChangedEvent(result.updatedPhase));
        //TODO return available players to steal from maybe.

        return EventResult.of(serverEvents, Map.of());
    }

    private record MutationResult(
            Hex robbedHex,
            GamePhase updatedPhase
    ) {
    }
}