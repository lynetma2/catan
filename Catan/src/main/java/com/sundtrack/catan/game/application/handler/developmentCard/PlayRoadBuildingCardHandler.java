package com.sundtrack.catan.game.application.handler.developmentCard;

import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.event.action.developmentCard.PlayRoadBuildingAction;
import com.sundtrack.catan.game.domain.event.server.developmentCard.DevelopmentCardSpentEvent;
import com.sundtrack.catan.game.domain.event.server.developmentCard.PlayRoadBuildingEvent;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import com.sundtrack.catan.game.application.handler.GameActionHandler;
import com.sundtrack.catan.game.application.GameContext;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@HandlesEvent(PlayRoadBuildingAction.class)
public class PlayRoadBuildingCardHandler implements GameActionHandler<PlayRoadBuildingAction> {

    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, PlayRoadBuildingAction action) {
        doValidations(game, context, action);
        game.playRoadBuildingCard(context.playerId(), action.cardId());

        return createResults(context, action.cardId());
    }

    private void doValidations(Game game, GameContext context, PlayRoadBuildingAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private EventResult<ServerEvent> createResults(GameContext context, UUID cardId) {
        List<ServerEvent> broadcastEvents = List.of(new PlayRoadBuildingEvent(context.playerId()));

        List<ServerEvent> directedToPlayer = new ArrayList<>();
        directedToPlayer.add(new DevelopmentCardSpentEvent(context.playerId(), cardId));

        Map<UUID, List<ServerEvent>> directed = Map.of(context.playerId(), directedToPlayer);
        return EventResult.of(broadcastEvents, directed);
    }
}
