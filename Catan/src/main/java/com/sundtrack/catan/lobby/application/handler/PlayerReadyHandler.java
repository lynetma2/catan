package com.sundtrack.catan.lobby.application.handler;

import com.sundtrack.catan.lobby.application.LobbyContext;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.lobby.domain.event.action.PlayerReadyAction;
import com.sundtrack.catan.lobby.domain.event.server.PlayerReadyEvent;
import com.sundtrack.catan.lobby.domain.Lobby;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import com.sundtrack.catan.lobby.persistence.LobbyStore;
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
