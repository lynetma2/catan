package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.inbound.InboundGameEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.session.game.GameEventDispatcher;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GameServiceImpl {

    private final GameStore gameStore;
    private final GameEventDispatcher dispatcher;

    public GameServiceImpl(GameStore gameStore, GameEventDispatcher dispatcher) {
        this.gameStore = gameStore;
        this.dispatcher = dispatcher;
    }

    public EventResult handle(UUID gameId, InboundGameEvent event) {
        Game game = gameStore.get(gameId);

        synchronized (game) {
            EventResult result = dispatcher.dispatch(game, event);
            gameStore.persist(game);
            return result;
        }
    }
}