package com.sundtrack.catan.session.lobby.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.action.LobbyReconnectAction;
import com.sundtrack.catan.datalayer.domain.event.lobby.reason.LobbyReconnectRejectionReason;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.LobbyReconnectRejectedEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.LobbyStateEvent;
import com.sundtrack.catan.datalayer.domain.lobby.Lobby;
import com.sundtrack.catan.datalayer.dto.mapper.LobbyMapper;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.lobby.services.LobbyStore;
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
