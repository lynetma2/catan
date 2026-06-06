package com.sundtrack.catan.session.lobby.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.action.GameStartAction;
import com.sundtrack.catan.datalayer.domain.event.lobby.reason.GameStartRejectionReason;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.GameInitializedEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.GameStartRejectedEvent;
import com.sundtrack.catan.datalayer.domain.lobby.Lobby;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.services.interfaces.GameService;
import com.sundtrack.catan.session.lobby.services.LobbyStore;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@HandlesEvent(GameStartAction.class)
public class GameStartHandler implements LobbyActionHandler<GameStartAction> {
    private final LobbyStore lobbyStore;
    private final GameService gameService;

    public GameStartHandler(LobbyStore lobbyStore, GameService gameService) {
        this.lobbyStore = lobbyStore;
        this.gameService = gameService;
    }

    @Override
    public EventResult<ServerEvent> handle(LobbyContext context, GameStartAction action) {
        UUID playerId = context.playerId();
        UUID lobbyId = context.lobbyId();
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

        gameService.createGame(lobbyId);
        lobby.markAsStarted();
        lobbyStore.remove(lobbyId);

        return EventResult.broadcast(new GameInitializedEvent());
    }
}
