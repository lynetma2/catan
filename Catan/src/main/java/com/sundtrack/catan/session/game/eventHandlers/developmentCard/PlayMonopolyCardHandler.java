package com.sundtrack.catan.session.game.eventHandlers.developmentCard;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.developmentCard.PlayMonopolyAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard.DevelopmentCardSpentEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard.PlayMonopolyEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceGrantEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.resource.ResourceSpentEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;
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
@HandlesEvent(PlayMonopolyAction.class)
public class PlayMonopolyCardHandler implements GameActionHandler<PlayMonopolyAction> {
    private final GameStore gameStore;

    public PlayMonopolyCardHandler(GameStore gameStore) {
        this.gameStore = gameStore;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, PlayMonopolyAction action) {
        Game game = gameStore.get(context.gameId());

        doValidations(game, context, action);
        Map<UUID, List<Resource>> result = game.playMonopolyCard(context.playerId(), action.cardId(), action.resourceType());

        return createResults(result, context.playerId(), action.cardId(), action.resourceType());
    }

    private void doValidations(Game game, GameContext context, PlayMonopolyAction action) {
        game.validateCurrentPlayer(context.playerId());
        game.getCurrentPhase().validateAllowedAction(action);
    }

    private EventResult<ServerEvent> createResults(Map<UUID, List<Resource>> results, UUID playerId, UUID cardId, ResourceType resourceType) {
        List<ServerEvent> broadcastEvents = new ArrayList<>();
        broadcastEvents.add(new PlayMonopolyEvent(resourceType, playerId));
        broadcastEvents.addAll(createEvents(results, playerId));

        List<ServerEvent> directedToPlayer = new ArrayList<>();
        directedToPlayer.add(new DevelopmentCardSpentEvent(playerId, cardId));

        Map<UUID, List<ServerEvent>> directed = Map.of(playerId, directedToPlayer);
        return EventResult.of(broadcastEvents, directed);
    }

    private List<ServerEvent> createEvents(Map<UUID, List<Resource>> results, UUID playerId) {
        List<ServerEvent> events = new ArrayList<>();

        for (UUID id : results.keySet()) {
            List<Resource> value = results.get(id);

            if (playerId == id) {
                events.add(new ResourceGrantEvent(id, value));
            } else {
                events.add(new ResourceSpentEvent(id, value));
            }
        }

        return events;
    }
}
