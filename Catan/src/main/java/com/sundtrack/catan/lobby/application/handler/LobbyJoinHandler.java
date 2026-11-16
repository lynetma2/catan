package com.sundtrack.catan.lobby.application.handler;

import com.sundtrack.catan.lobby.application.LobbyContext;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.lobby.domain.event.action.LobbyJoinAction;
import com.sundtrack.catan.lobby.domain.event.reason.LobbyJoinRejectionReason;
import com.sundtrack.catan.lobby.domain.event.server.LobbyJoinRejectedEvent;
import com.sundtrack.catan.lobby.domain.event.server.LobbyStateEvent;
import com.sundtrack.catan.lobby.domain.event.server.PlayerJoinEvent;
import com.sundtrack.catan.lobby.domain.Lobby;
import com.sundtrack.catan.lobby.domain.LobbyPlayer;
import com.sundtrack.catan.lobby.dto.mapper.LobbyMapper;
import com.sundtrack.catan.shared.ws.HandlesEvent;
import com.sundtrack.catan.lobby.persistence.LobbyStore;
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
