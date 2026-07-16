package com.sundtrack.catan.session.lobby.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.action.LobbyJoinAction;
import com.sundtrack.catan.datalayer.domain.event.lobby.reason.LobbyJoinRejectionReason;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.LobbyJoinRejectedEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.LobbyStateEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.PlayerJoinEvent;
import com.sundtrack.catan.datalayer.domain.lobby.Lobby;
import com.sundtrack.catan.datalayer.domain.lobby.LobbyPlayer;
import com.sundtrack.catan.datalayer.dto.mapper.LobbyMapper;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.lobby.services.LobbyStore;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@HandlesEvent(LobbyJoinAction.class)
public class LobbyJoinHandler implements LobbyActionHandler<LobbyJoinAction> {
    private final LobbyStore lobbyStore;
    private final LobbyMapper lobbyMapper;

    public LobbyJoinHandler(LobbyStore lobbyStore, LobbyMapper lobbyMapper) {
        this.lobbyStore = lobbyStore;
        this.lobbyMapper = lobbyMapper;
    }

    @Override
    public EventResult<ServerEvent> handle(LobbyContext context, LobbyJoinAction action) {
        UUID lobbyId = context.lobbyId();
        UUID playerId = context.playerId();

        Lobby lobby = lobbyStore.get(lobbyId);

        if (lobby.isFull()) {
            return EventResult.directed(
                    playerId,
                    new LobbyJoinRejectedEvent(LobbyJoinRejectionReason.LOBBY_FULL)
            );
        }

        if (lobby.hasStarted()) {
            return EventResult.directed(
                    playerId,
                    new LobbyJoinRejectedEvent(LobbyJoinRejectionReason.GAME_ALREADY_STARTED)
            );
        }
        
        if (lobby.hasPlayer(playerId)) {
            return EventResult.directed(
                    playerId,
                    new LobbyJoinRejectedEvent(LobbyJoinRejectionReason.ALREADY_IN_LOBBY)
            );
        }

        lobby.addPlayer(new LobbyPlayer(playerId, action.playerName(), false, false));

        return EventResult.of(
                List.of(new PlayerJoinEvent(playerId, action.playerName())),
                Map.of(playerId, List.of(new LobbyStateEvent(lobbyId, lobbyMapper.toSnapshotDTO(lobby), playerId)))
        );
    }
}
