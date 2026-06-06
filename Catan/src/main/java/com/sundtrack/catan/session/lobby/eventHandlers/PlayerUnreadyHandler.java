package com.sundtrack.catan.session.lobby.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.action.PlayerUnreadyAction;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.PlayerUnreadyEvent;
import com.sundtrack.catan.datalayer.domain.lobby.Lobby;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.lobby.services.LobbyStore;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@HandlesEvent(PlayerUnreadyAction.class)
public class PlayerUnreadyHandler implements LobbyActionHandler<PlayerUnreadyAction> {
    private final LobbyStore lobbyStore;

    public PlayerUnreadyHandler(LobbyStore lobbyStore) {
        this.lobbyStore = lobbyStore;
    }

    @Override
    public EventResult<ServerEvent> handle(LobbyContext context, PlayerUnreadyAction action) {
        UUID playerId = context.playerId();
        UUID lobbyId = context.lobbyId();

        Lobby lobby = lobbyStore.get(lobbyId);
        lobby.setUnready(playerId);

        return EventResult.broadcast(new PlayerUnreadyEvent(playerId));
    }
}
