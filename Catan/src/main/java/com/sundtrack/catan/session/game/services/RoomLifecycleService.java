package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.activeSessions.GameSessionRegistry;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.session.game.services.interfaces.ActiveGameRegistry;
import com.sundtrack.catan.session.game.services.interfaces.GameArchive;
import com.sundtrack.catan.session.lobby.services.LobbyStore; // <--- Import your existing store
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.*;

@Service
public class RoomLifecycleService {

    private static final Duration GRACE_PERIOD = Duration.ofMinutes(5);

    private final ActiveGameRegistry activeGames;
    private final GameArchive gameArchive;
    private final LobbyStore lobbyStore; // <--- Use your existing store
    private final GameSessionRegistry sessions;

    private final ScheduledExecutorService scheduler = new ScheduledThreadPoolExecutor(1);
    private final ConcurrentHashMap<UUID, ScheduledFuture<?>> pending = new ConcurrentHashMap<>();

    public RoomLifecycleService(ActiveGameRegistry activeGames, GameArchive gameArchive,
                                LobbyStore lobbyStore, GameSessionRegistry sessions) {
        this.activeGames = activeGames;
        this.gameArchive = gameArchive;
        this.lobbyStore = lobbyStore;
        this.sessions = sessions;
    }

    /**
     * Someone (re)connected to the room: cancel any scheduled cleanup.
     */
    public void onPlayerConnected(UUID roomId) {
        ScheduledFuture<?> future = pending.remove(roomId);
        if (future != null) future.cancel(false);
    }

    /**
     * Last known subscription/session for the room is gone: schedule cleanup after grace period.
     */
    public void onRoomPossiblyEmpty(UUID roomId) {
        if (sessions.hasConnectedSessions(roomId)) return;
        pending.computeIfAbsent(roomId, id -> scheduler.schedule(
                () -> {
                    pending.remove(id);
                    abandon(id);
                },
                GRACE_PERIOD.toMillis(), TimeUnit.MILLISECONDS));
    }

    private void abandon(UUID roomId) {
        if (sessions.hasConnectedSessions(roomId)) return; // someone came back during grace

        // Phase 2: a game exists (running or finished)
        Optional<Game> game = activeGames.findActive(roomId);
        if (game.isPresent()) {
            if (game.get().getCurrentPhase() != GamePhase.GAME_OVER) {
                gameArchive.archive(game.get());
            }
            activeGames.unregister(roomId);
            return;
        }

        // Phase 1: still a lobby — discard the empty lobby
        lobbyStore.remove(roomId); // <--- Calls your existing ConcurrentHashMap.remove()
    }
}