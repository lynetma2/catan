package com.sundtrack.catan.lobby.application.handler;

import com.sundtrack.catan.lobby.application.LobbyContext;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.lobby.domain.event.action.PlayerUnreadyAction;
import com.sundtrack.catan.lobby.domain.event.server.PlayerUnreadyEvent;
import com.sundtrack.catan.lobby.domain.Lobby;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import com.sundtrack.catan.lobby.persistence.LobbyStore;
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
