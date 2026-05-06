package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.game.inbound.InboundGameEvent;
import com.sundtrack.catan.datalayer.domain.event.game.outbound.OutboundGameEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.GameInitializedEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.session.game.GameEventDispatcher;
import com.sundtrack.catan.session.game.services.interfaces.GameCreationService;
import com.sundtrack.catan.session.game.services.interfaces.GameService;
import org.springframework.stereotype.Service;

import java.util.Set;
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

    public EventResult<OutboundGameEvent> handle(UUID gameId, InboundGameEvent event) {
        Game game = gameStore.get(gameId);

        synchronized (game) {
            EventResult<OutboundGameEvent> result = dispatcher.dispatch(game, event);
            gameStore.persist(game);
            return result;
        }
    }

    public Game createGame(UUID id, Set<UUID> playerIds) {
        Game game = gameCreationService.createGame(id, playerIds);
        gameStore.add(game.getId(), game);
        return game;
    }
}