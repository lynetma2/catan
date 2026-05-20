package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.game.action.GameActionEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.GameServerEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.session.game.GameEventDispatcher;
import com.sundtrack.catan.session.game.services.interfaces.GameCreationService;
import com.sundtrack.catan.session.game.services.interfaces.GameService;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.UUID;

@Service
public class GameServiceImpl implements GameService {

    private final GameStore gameStore;
    private final GameCreationService gameCreationService;
    private final GameEventDispatcher dispatcher;

    public GameServiceImpl(GameStore gameStore, GameEventDispatcher dispatcher, GameCreationService gameCreationService) {
        this.gameStore = gameStore;
        this.dispatcher = dispatcher;
        this.gameCreationService = gameCreationService;
    }

    public EventResult<GameServerEvent> handle(Principal principal, UUID gameId, GameActionEvent event) {
        Game game = gameStore.get(gameId);

        synchronized (game) {
            EventResult<GameServerEvent> result = dispatcher.dispatch(game, event, principal);
            gameStore.persist(game);
            return result;
        }
    }

    public void createGame(UUID id) {
        Game game = gameCreationService.createGame(id);
        gameStore.add(game.getId(), game);
    }
}