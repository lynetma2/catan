package com.sundtrack.catan.session.game.eventHandlers.developmentCard;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.developmentCard.PlayKnightAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard.PlayKnightEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.apache.catalina.Server;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(PlayKnightAction.class)
public class PlayKnightCardHandler implements GameActionHandler<PlayKnightAction> {
    private final GameStore gameStore;

    public PlayKnightCardHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, PlayKnightAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        game.playKnightCard(context.playerId(), action.cardId());

        List<ServerEvent> events = List.of(new PlayKnightEvent(context.playerId()));
        return EventResult.of(events, Map.of());
    }

    private void doValidations(Game game, GameContext context, PlayKnightAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }
}
