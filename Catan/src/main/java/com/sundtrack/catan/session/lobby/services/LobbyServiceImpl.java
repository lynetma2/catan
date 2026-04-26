package com.sundtrack.catan.session.lobby.services;

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

    public EventResult<OutboundLobbyEvent> handle(UUID lobbyId, InboundLobbyEvent event) {
        return switch (event) {
            case LobbyCreateRequestedEvent e  -> createLobby(e);
            case LobbyJoinRequestedEvent e    -> joinLobby(lobbyId, e);
            case PlayerReadyRequestedEvent e  -> playerReady(lobbyId, e);
            case PlayerUnreadyRequestedEvent e -> playerUnready(lobbyId, e);
            case LobbyReconnectRequestedEvent e -> reconnectToLobby(e);
            case GameStartRequestedEvent e    -> startGame(lobbyId, e);
        };
    }

    private EventResult<OutboundLobbyEvent> createLobby(LobbyCreateRequestedEvent event) {
        if (lobbyStore.existsByPlayerId(event.playerId())) {
            return EventResult.directed(
                    event.playerId(),
                    new LobbyJoinRejectedEvent(LobbyJoinRejectionReason.ALREADY_IN_LOBBY)
            );
        }

        Lobby lobby = new Lobby(new LobbyPlayer(event.playerId(), event.playerName(), true, true));
        UUID lobbyId = lobby.getId();
        lobbyStore.add(lobbyId, lobby);

        return EventResult.directed(
                event.playerId(),
                new LobbyCreatedEvent(lobbyId, event.playerId(), event.playerName())
        );
    }

    private EventResult<OutboundLobbyEvent> joinLobby(UUID lobbyId, LobbyJoinRequestedEvent event) {
        Lobby lobby = lobbyStore.get(lobbyId);

        if (lobby.isFull()) {
            return EventResult.directed(
                    event.playerId(),
                    new LobbyJoinRejectedEvent(LobbyJoinRejectionReason.LOBBY_FULL)
            );
        }

        if (lobby.hasStarted()) {
            return EventResult.directed(
                    event.playerId(),
                    new LobbyJoinRejectedEvent(LobbyJoinRejectionReason.GAME_ALREADY_STARTED)
            );
        }

        lobby.addPlayer(new LobbyPlayer(event.playerId(), event.playerName(), false, false));

        return EventResult.of(
                List.of(new PlayerJoinedLobbyEvent(event.playerId(), event.playerName())),
                Map.of(event.playerId(), new LobbyStateEvent(lobbyId, lobbyMapper.toSnapshotDTO(lobby)))
        );
    }

    private EventResult<OutboundLobbyEvent> playerReady(UUID lobbyId, PlayerReadyRequestedEvent event) {
        Lobby lobby = lobbyStore.get(lobbyId);
        lobby.setReady(event.playerId());

        return EventResult.broadcast(
                new PlayerReadyEvent(event.playerId())
        );
    }

    private EventResult<OutboundLobbyEvent> playerUnready(UUID lobbyId, PlayerUnreadyRequestedEvent event) {
        Lobby lobby = lobbyStore.get(lobbyId);
        lobby.setUnready(event.playerId());

        return EventResult.broadcast(
                new PlayerUnreadyEvent(event.playerId())
        );
    }

    private EventResult<OutboundLobbyEvent> startGame(UUID lobbyId, GameStartRequestedEvent event) {
        Lobby lobby = lobbyStore.get(lobbyId);

        if (!lobby.isLeader(event.playerId())) {
            return EventResult.directed(
                    event.playerId(),
                    new GameStartRejectedEvent(GameStartRejectionReason.NOT_LEADER)
            );
        }

        if (!lobby.allPlayersReady()) {
            return EventResult.directed(
                    event.playerId(),
                    new GameStartRejectedEvent(GameStartRejectionReason.PLAYERS_NOT_READY)
            );
        }

        if (lobby.playerCount() < 2) {
            return EventResult.directed(
                    event.playerId(),
                    new GameStartRejectedEvent(GameStartRejectionReason.NOT_ENOUGH_PLAYERS)
            );
        }

        // Hand off to game domain
        Game game = gameService.createGame(lobby.getPlayerIds());

        lobby.markAsStarted();
        lobbyStore.remove(lobbyId);

        // Lobby service constructs this event — no casting needed
        return EventResult.broadcast(
                new GameInitializedEvent(gameMapper.toSnapshotDTO(game))
        );
    }

    private EventResult<OutboundLobbyEvent> reconnectToLobby(LobbyReconnectRequestedEvent event) {
        Lobby lobby = lobbyStore.get(event.lobbyId());
        if (lobby == null) {
            return EventResult.directed(
                    event.playerId(),
                    new LobbyNotFoundError(event.lobbyId())
            );
        }

        if (!lobby.hasPlayer(event.playerId())) {
            return EventResult.directed(
                    event.playerId(),
                    new LobbyReconnectRejectionEvent(LobbyReconnectRejectionReason.PLAYER_NOT_IN_LOBBY)
            );
        }

        return EventResult.directed(
                event.playerId(),
                new LobbyStateEvent(event.lobbyId(), lobbyMapper.toSnapshotDTO(lobby))
        );
    }
}