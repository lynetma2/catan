package com.sundtrack.catan.lobby.application.handler;

import com.sundtrack.catan.lobby.application.LobbyContext;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.lobby.domain.event.action.LobbyReconnectAction;
import com.sundtrack.catan.lobby.domain.event.reason.LobbyReconnectRejectionReason;
import com.sundtrack.catan.lobby.domain.event.server.LobbyReconnectRejectedEvent;
import com.sundtrack.catan.lobby.domain.event.server.LobbyStateEvent;
import com.sundtrack.catan.lobby.domain.Lobby;
import com.sundtrack.catan.lobby.dto.mapper.LobbyMapper;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import com.sundtrack.catan.lobby.persistence.LobbyStore;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@HandlesEvent(LobbyReconnectAction.class)
public class LobbyReconnectHandler implements LobbyActionHandler<LobbyReconnectAction> {
    private final LobbyStore lobbyStore;
    private final LobbyMapper lobbyMapper;

    public LobbyReconnectHandler(LobbyStore lobbyStore, LobbyMapper lobbyMapper) {
        this.lobbyStore = lobbyStore;
        this.lobbyMapper = lobbyMapper;
    }

    @Override
    public EventResult<ServerEvent> handle(LobbyContext context, LobbyReconnectAction action) {
        UUID lobbyId = context.lobbyId();
        UUID playerId = context.playerId();

        Lobby lobby = lobbyStore.get(lobbyId);
        if (lobby == null) {
            return EventResult.directed(
                    playerId,
                    new LobbyReconnectRejectedEvent(LobbyReconnectRejectionReason.PLAYER_NOT_IN_LOBBY)
            );
        }

        if (!lobby.hasPlayer(playerId)) {
            return EventResult.directed(
                    playerId,
                    new LobbyReconnectRejectedEvent(LobbyReconnectRejectionReason.PLAYER_NOT_IN_LOBBY)
            );
        }

        return EventResult.directed(
                playerId,
                new LobbyStateEvent(lobbyId, lobbyMapper.toSnapshotDTO(lobby), playerId)
        );
    }
}
