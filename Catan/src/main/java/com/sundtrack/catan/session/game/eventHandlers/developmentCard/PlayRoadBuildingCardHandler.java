package com.sundtrack.catan.session.game.eventHandlers.developmentCard;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.developmentCard.PlayKnightAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.developmentCard.PlayRoadBuildingAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard.PlayKnightEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard.PlayRoadBuildingEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(PlayRoadBuildingAction.class)
public class PlayRoadBuildingCardHandler implements GameActionHandler<PlayRoadBuildingAction> {
    private final GameStore gameStore;

    public PlayRoadBuildingCardHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, PlayRoadBuildingAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        game.playRoadBuildingCard(context.playerId(), action.cardId());

        List<ServerEvent> events = List.of(new PlayRoadBuildingEvent(context.playerId()));
        return EventResult.of(events, Map.of());
    }

    private void doValidations(Game game, GameContext context, PlayRoadBuildingAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }
}
