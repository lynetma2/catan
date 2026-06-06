package com.sundtrack.catan.session.lobby.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.action.LobbyCreateAction;
import com.sundtrack.catan.datalayer.domain.event.lobby.reason.LobbyJoinRejectionReason;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.LobbyJoinRejectedEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.LobbyStateEvent;
import com.sundtrack.catan.datalayer.domain.lobby.Lobby;
import com.sundtrack.catan.datalayer.domain.lobby.LobbyPlayer;
import com.sundtrack.catan.datalayer.dto.mapper.LobbyMapper;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.lobby.services.LobbyStore;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@HandlesEvent(LobbyCreateAction.class)
public class LobbyCreateHandler implements LobbyActionHandler<LobbyCreateAction> {
    private final LobbyStore lobbyStore;
    private final LobbyMapper lobbyMapper;

    public LobbyCreateHandler(LobbyStore lobbyStore, LobbyMapper lobbyMapper) {
        this.lobbyStore = lobbyStore;
        this.lobbyMapper = lobbyMapper;
    }

    @Override
    public EventResult<ServerEvent> handle(LobbyContext context, LobbyCreateAction action) {
        UUID playerId = context.playerId();
        if (lobbyStore.existsByPlayerId(playerId)) {
            return EventResult.directed(
                    playerId,
                    new LobbyJoinRejectedEvent(LobbyJoinRejectionReason.ALREADY_IN_LOBBY)
            );
        }

        Lobby lobby = new Lobby(new LobbyPlayer(playerId, action.playerName(), true, true));
        UUID lobbyId = lobby.getId();
        lobbyStore.add(lobbyId, lobby);

        return EventResult.directed(
                playerId,
                new LobbyStateEvent(lobbyId, lobbyMapper.toSnapshotDTO(lobby), playerId)
        );
    }
}
