package com.sundtrack.catan.session.game.eventHandlers.developmentCard;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.developmentCard.PlayKnightAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard.DevelopmentCardSpentEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard.PlayKnightEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@HandlesEvent(PlayKnightAction.class)
public class PlayKnightCardHandler implements GameActionHandler<PlayKnightAction> {
    
    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, PlayKnightAction action) {
        doValidations(game, context, action);
        game.playKnightCard(context.playerId(), action.cardId());

        return createResults(context, action.cardId());
    }

    private void doValidations(Game game, GameContext context, PlayKnightAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private EventResult<ServerEvent> createResults(GameContext context, UUID cardId) {
        List<ServerEvent> broadcastEvents = List.of(new PlayKnightEvent(context.playerId()));

        List<ServerEvent> directedToPlayer = new ArrayList<>();
        directedToPlayer.add(new DevelopmentCardSpentEvent(context.playerId(), cardId));

        Map<UUID, List<ServerEvent>> directed = Map.of(context.playerId(), directedToPlayer);
        return EventResult.of(broadcastEvents, directed);
    }
}
