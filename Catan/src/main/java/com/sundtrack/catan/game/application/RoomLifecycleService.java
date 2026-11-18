package com.sundtrack.catan.game.application;

import com.sundtrack.catan.presence.application.GameSessionRegistry;
import com.sundtrack.catan.game.application.port.GameQueryPort;
import com.sundtrack.catan.game.application.port.GameStorePort;
import com.sundtrack.catan.lobby.persistence.LobbyStore;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;
import java.util.concurrent.*;

@Service
public class RoomLifecycleService {

    private static final Duration GRACE_PERIOD = Duration.ofMinutes(5);

    private final GameStorePort gameStore;
    private final GameQueryPort gameQuery;
    private final LobbyStore lobbyStore;
    private final GameSessionRegistry sessions;

    private final ScheduledExecutorService scheduler = new ScheduledThreadPoolExecutor(1);
    private final ConcurrentHashMap<UUID, ScheduledFuture<?>> pending = new ConcurrentHashMap<>();

    public RoomLifecycleService(GameStorePort gameStore, GameQueryPort gameQuery,
                                LobbyStore lobbyStore, GameSessionRegistry sessions) {
        this.gameStore = gameStore;
        this.gameQuery = gameQuery;
        this.lobbyStore = lobbyStore;
        this.sessions = sessions;
    }

    /** Someone (re)connected to the room: cancel any scheduled cleanup. */
    public void onPlayerConnected(UUID roomId) {
        ScheduledFuture<?> future = pending.remove(roomId);
        if (future != null) future.cancel(false);
    }

    /** Last known session for the room is gone: schedule cleanup after the grace period. */
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

        if (gameQuery.exists(roomId)) {
            // Game is already persisted. Only a still-running one needs flagging.
            if (gameStore.isActive(roomId)) {
                gameStore.markAbandoned(roomId);
            }
            return; // FINISHED games are already stored — nothing to do
        }

        // Still a lobby — discard the empty lobby.
        lobbyStore.remove(roomId);
    }
}