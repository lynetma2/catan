package com.sundtrack.catan.session.lobby.services;

import com.sundtrack.catan.common.handlers.AnonymousPrincipalHandshakeHandler;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.GameInitializedEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.inbound.*;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.*;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.lobby.Lobby;
import com.sundtrack.catan.datalayer.domain.lobby.LobbyPlayer;
import com.sundtrack.catan.datalayer.dto.mapper.GameMapper;
import com.sundtrack.catan.datalayer.dto.mapper.LobbyMapper;
import com.sundtrack.catan.session.game.services.interfaces.GameService;
import com.sundtrack.catan.session.lobby.services.interfaces.LobbyService;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class LobbyServiceImpl implements LobbyService {

    private final LobbyStore lobbyStore;
    private final GameService gameService;
    private final GameMapper gameMapper;
    private final LobbyMapper lobbyMapper;

    public LobbyServiceImpl(LobbyStore lobbyStore, GameService gameService, GameMapper gameMapper, LobbyMapper lobbyMapper) {
        this.lobbyStore = lobbyStore;
        this.gameService = gameService;
        this.gameMapper = gameMapper;
        this.lobbyMapper = lobbyMapper;
    }

    public EventResult<OutboundLobbyEvent> handle(Principal principal, UUID lobbyId, InboundLobbyEvent event) {
        UUID playerId = extractPlayerId(principal);
        return switch (event) {
            case LobbyCreateRequestedEvent e   -> createLobby(playerId, e);
            case LobbyJoinRequestedEvent e     -> joinLobby(playerId, lobbyId, e);
            case PlayerReadyRequestedEvent e   -> playerReady(playerId, lobbyId);
            case PlayerUnreadyRequestedEvent e -> playerUnready(playerId, lobbyId);
            case LobbyReconnectRequestedEvent e -> reconnectToLobby(playerId, e);
            case GameStartRequestedEvent e     -> startGame(playerId, lobbyId);
        };
    }

    @Override
    public EventResult<OutboundLobbyEvent> handleDisconnect(Principal principal, UUID lobbyId) {
        UUID playerId = extractPlayerId(principal);
        Lobby lobby = lobbyStore.get(lobbyId);
        lobby.removePlayer(playerId);

        if (lobby.isNotEmpty()) {
            return EventResult.broadcast(new PlayerDisconnectedEvent(playerId));
        } else {
            lobbyStore.remove(lobbyId);
        }

        return EventResult.empty();
    }

    private EventResult<OutboundLobbyEvent> createLobby(UUID playerId, LobbyCreateRequestedEvent event) {
        if (lobbyStore.existsByPlayerId(playerId)) {
            return EventResult.directed(
                    playerId,
                    new LobbyJoinRejectedEvent(LobbyJoinRejectionReason.ALREADY_IN_LOBBY)
            );
        }

        Lobby lobby = new Lobby(new LobbyPlayer(playerId, event.playerName(), true, true));
        UUID lobbyId = lobby.getId();
        lobbyStore.add(lobbyId, lobby);

        return EventResult.directed(
                playerId,
                new LobbyStateEvent(lobbyId, lobbyMapper.toSnapshotDTO(lobby))
        );
    }

    private EventResult<OutboundLobbyEvent> joinLobby(UUID playerId, UUID lobbyId, LobbyJoinRequestedEvent event) {
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

        lobby.addPlayer(new LobbyPlayer(playerId, event.playerName(), false, false));

        return EventResult.of(
                List.of(new PlayerJoinedLobbyEvent(playerId, event.playerName())),
                Map.of(playerId, new LobbyStateEvent(lobbyId, lobbyMapper.toSnapshotDTO(lobby)))
        );
    }

    private EventResult<OutboundLobbyEvent> playerReady(UUID playerId, UUID lobbyId) {
        Lobby lobby = lobbyStore.get(lobbyId);
        lobby.setReady(playerId);

        return EventResult.broadcast(new PlayerReadyEvent(playerId));
    }

    private EventResult<OutboundLobbyEvent> playerUnready(UUID playerId, UUID lobbyId) {
        Lobby lobby = lobbyStore.get(lobbyId);
        lobby.setUnready(playerId);

        return EventResult.broadcast(new PlayerUnreadyEvent(playerId));
    }

    private EventResult<OutboundLobbyEvent> startGame(UUID playerId, UUID lobbyId) {
        Lobby lobby = lobbyStore.get(lobbyId);

        if (!lobby.isLeader(playerId)) {
            return EventResult.directed(
                    playerId,
                    new GameStartRejectedEvent(GameStartRejectionReason.NOT_LEADER)
            );
        }

        if (!lobby.allPlayersReady()) {
            return EventResult.directed(
                    playerId,
                    new GameStartRejectedEvent(GameStartRejectionReason.PLAYERS_NOT_READY)
            );
        }

        if (lobby.playerCount() < 2) {
            return EventResult.directed(
                    playerId,
                    new GameStartRejectedEvent(GameStartRejectionReason.NOT_ENOUGH_PLAYERS)
            );
        }

        Game game = gameService.createGame(lobby.getPlayerIds());
        lobby.markAsStarted();
        lobbyStore.remove(lobbyId);

        return EventResult.broadcast(new GameInitializedEvent(gameMapper.toSnapshotDTO(game)));
    }

    private EventResult<OutboundLobbyEvent> reconnectToLobby(UUID playerId, LobbyReconnectRequestedEvent event) {
        Lobby lobby = lobbyStore.get(event.lobbyId());
        if (lobby == null) {
            return EventResult.directed(
                    playerId,
                    new LobbyNotFoundError(event.lobbyId())
            );
        }

        if (!lobby.hasPlayer(playerId)) {
            return EventResult.directed(
                    playerId,
                    new LobbyReconnectRejectionEvent(LobbyReconnectRejectionReason.PLAYER_NOT_IN_LOBBY)
            );
        }

        return EventResult.directed(
                playerId,
                new LobbyStateEvent(event.lobbyId(), lobbyMapper.toSnapshotDTO(lobby))
        );
    }

    private UUID extractPlayerId(Principal principal) {
        if (principal instanceof AnonymousPrincipalHandshakeHandler.StompPrincipal stomp) {
            return UUID.fromString(stomp.getUuid());
        }
        throw new IllegalStateException("Principal is not a StompPrincipal");
    }
}