package com.sundtrack.catan.session.game.eventHandlers.developmentCard;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.developmentCard.PlayYearOfPlentyAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard.DevelopmentCardSpentEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard.PlayYearOfPlentyEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceGrantEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@HandlesEvent(PlayYearOfPlentyAction.class)
public class PlayYearOfPlentyCardHandler implements GameActionHandler<PlayYearOfPlentyAction> {

    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, PlayYearOfPlentyAction action) {
        doValidations(game, context, action);
        List<Resource> result = game.playYearOfPlentyCard(context.playerId(), action.cardId(), action.firstResource(), action.secondResource());

        return createResults(context, action, result);
    }

    private void doValidations(Game game, GameContext context, PlayYearOfPlentyAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private EventResult<ServerEvent> createResults(GameContext context, PlayYearOfPlentyAction action, List<Resource> result) {
        List<ServerEvent> broadcastEvents = List.of(new PlayYearOfPlentyEvent(action.firstResource(), action.secondResource(), context.playerId()),
                new ResourceGrantEvent(context.playerId(), result));
        List<ServerEvent> directedToPlayer = new ArrayList<>();
        directedToPlayer.add(new DevelopmentCardSpentEvent(context.playerId(), action.cardId()));

        Map<UUID, List<ServerEvent>> directed = Map.of(context.playerId(), directedToPlayer);
        return EventResult.of(broadcastEvents, directed);
    }
}
