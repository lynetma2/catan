package com.sundtrack.catan.session.game.eventHandlers.developmentCard;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.developmentCard.DrawDevelopmentCardAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard.DrawDevelopmentCardEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.dto.snapshot.DevCardSnapshotDTO;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameActionHandler;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@HandlesEvent(DrawDevelopmentCardAction.class)
public class DrawDevelopmentCardHandler implements GameActionHandler<DrawDevelopmentCardAction> {
    private final GameStore gameStore;

    public DrawDevelopmentCardHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, DrawDevelopmentCardAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        DevCardSnapshotDTO card = game.drawDevelopmentCard(context.playerId());

        return createResults(context, card);
    }

    private void doValidations(Game game, GameContext context, DrawDevelopmentCardAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private EventResult<ServerEvent> createResults(GameContext context, DevCardSnapshotDTO card) {
        DrawDevelopmentCardEvent event = new DrawDevelopmentCardEvent(card);
        //TODO create event of spent resources.
        return EventResult.of(List.of(), Map.of(context.playerId(), List.of(event)));
    }
}
