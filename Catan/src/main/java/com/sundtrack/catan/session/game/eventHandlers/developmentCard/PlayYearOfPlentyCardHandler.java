package com.sundtrack.catan.session.game.eventHandlers.developmentCard;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.developmentCard.PlayMonopolyAction;
import com.sundtrack.catan.datalayer.domain.event.game.action.developmentCard.PlayYearOfPlentyAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard.PlayMonopolyEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard.PlayYearOfPlentyEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceGrantEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@HandlesEvent(PlayYearOfPlentyAction.class)
public class PlayYearOfPlentyCardHandler implements GameActionHandler<PlayYearOfPlentyAction> {
    private final GameStore gameStore;

    public PlayYearOfPlentyCardHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, PlayYearOfPlentyAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        List<Resource> result = game.playYearOfPlentyCard(context.playerId(), action.cardId(), action.firstResource(), action.secondResource());

        List<ServerEvent> events = List.of(new PlayYearOfPlentyEvent(action.firstResource(), action.secondResource(), context.playerId()),
                new ResourceGrantEvent(context.playerId(), result));

        return EventResult.of(events, Map.of());
    }

    private void doValidations(Game game, GameContext context, PlayYearOfPlentyAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }
}
