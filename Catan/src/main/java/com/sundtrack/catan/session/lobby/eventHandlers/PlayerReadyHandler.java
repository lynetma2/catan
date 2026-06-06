package com.sundtrack.catan.session.lobby.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.action.PlayerReadyAction;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.PlayerReadyEvent;
import com.sundtrack.catan.datalayer.domain.lobby.Lobby;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.lobby.services.LobbyStore;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@HandlesEvent(PlayerReadyAction.class)
public class PlayerReadyHandler implements LobbyActionHandler<PlayerReadyAction> {
    private final LobbyStore lobbyStore;

    public PlayerReadyHandler(LobbyStore lobbyStore) {
        this.lobbyStore = lobbyStore;
    }

    @Override
    public EventResult<ServerEvent> handle(LobbyContext context, PlayerReadyAction action) {
        UUID playerId = context.playerId();
        UUID lobbyId = context.lobbyId();

        Lobby lobby = lobbyStore.get(lobbyId);
        lobby.setReady(playerId);

        return EventResult.broadcast(new PlayerReadyEvent(playerId));
    }
}
