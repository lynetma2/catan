package com.sundtrack.catan.session.game.eventHandlers.developmentCard;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.developmentCard.DrawDevelopmentCardAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard.DrawDevelopmentCardEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
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
@HandlesEvent(DrawDevelopmentCardAction.class)
public class DrawDevelopmentCardHandler implements GameActionHandler<DrawDevelopmentCardAction> {
    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, DrawDevelopmentCardAction action) {
        doValidations(game, context, action);
        Game.DrawDevelopmentCardResult result = game.drawDevelopmentCard(context.playerId());

        return createResults(context, result);
    }

    private void doValidations(Game game, GameContext context, DrawDevelopmentCardAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private EventResult<ServerEvent> createResults(GameContext context, Game.DrawDevelopmentCardResult result) {
        List<ServerEvent> directedToPlayer = new ArrayList<>();
        directedToPlayer.add(new ResourceSpentEvent(context.playerId(), result.deductedResources()));
        directedToPlayer.add(new DrawDevelopmentCardEvent(result.card()));

        Map<UUID, List<ServerEvent>> directed = Map.of(context.playerId(), directedToPlayer);

        return EventResult.of(List.of(), directed);
    }
}
