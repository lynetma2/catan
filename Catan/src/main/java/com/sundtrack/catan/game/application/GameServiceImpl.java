package com.sundtrack.catan.game.application;

import com.sundtrack.catan.game.application.port.GameStorePort;
import com.sundtrack.catan.shared.util.PrincipalUtils;
import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.application.port.GameCreationService;
import com.sundtrack.catan.game.application.port.GameService;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameServiceImpl implements GameService {

    private final GameStorePort gameStore;
    private final GameCreationService gameCreationService;
    private final GameDispatcher dispatcher;
    private final ConcurrentHashMap<UUID, Object> gameLocks = new ConcurrentHashMap<>();

    public GameServiceImpl(GameStorePort gameStore, GameCreationService gameCreationService, GameDispatcher dispatcher) {
        this.gameStore = gameStore;
        this.gameCreationService = gameCreationService;
        this.dispatcher = dispatcher;
    }

    @Override
    public EventResult<ServerEvent> handle(Principal principal, UUID gameId, ClientAction action) {
        UUID playerId = PrincipalUtils.extractPlayerId(principal);
        GameContext context = new GameContext(principal, playerId, gameId);

        synchronized (lockFor(gameId)) {
            Optional<Game> active = gameStore.findActive(gameId);
            if (active.isEmpty()) {
                return dispatcher.dispatchFinished(context, action);
            }
            Game game = active.get();
            EventResult<ServerEvent> result = dispatcher.dispatch(context, game, action);
            gameStore.save(game);   // persist every mutation; adapter auto-finishes on GAME_OVER
            return result;
        }
    }

    @Override
    public void createGame(UUID id) {
        Game game = gameCreationService.createGame(id);
        gameStore.save(game);
    }

    private Object lockFor(UUID gameId) {
        return gameLocks.computeIfAbsent(gameId, id -> new Object());
    }
}