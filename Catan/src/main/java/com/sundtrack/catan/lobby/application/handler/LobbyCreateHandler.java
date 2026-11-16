package com.sundtrack.catan.lobby.application.handler;

import com.sundtrack.catan.lobby.application.LobbyContext;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.lobby.domain.event.action.LobbyCreateAction;
import com.sundtrack.catan.lobby.domain.event.reason.LobbyJoinRejectionReason;
import com.sundtrack.catan.lobby.domain.event.server.LobbyJoinRejectedEvent;
import com.sundtrack.catan.lobby.domain.event.server.LobbyStateEvent;
import com.sundtrack.catan.lobby.domain.Lobby;
import com.sundtrack.catan.lobby.domain.LobbyPlayer;
import com.sundtrack.catan.lobby.dto.mapper.LobbyMapper;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import com.sundtrack.catan.lobby.persistence.LobbyStore;
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
