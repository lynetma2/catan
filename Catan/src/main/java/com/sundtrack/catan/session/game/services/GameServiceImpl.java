package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.session.game.GameEventDispatcher;
import com.sundtrack.catan.session.game.services.interfaces.ActiveGameRegistry;
import com.sundtrack.catan.session.game.services.interfaces.GameArchive;
import com.sundtrack.catan.session.game.services.interfaces.GameCreationService;
import com.sundtrack.catan.session.game.services.interfaces.GameService;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.UUID;

@Service
public class GameServiceImpl implements GameService {

    private final ActiveGameRegistry activeGames;
    private final GameArchive gameArchive;
    private final GameCreationService gameCreationService;
    private final GameEventDispatcher dispatcher;

    public GameServiceImpl(
            ActiveGameRegistry activeGames,
            GameArchive gameArchive,
            GameCreationService gameCreationService,
            GameEventDispatcher dispatcher
    ) {
        this.activeGames = activeGames;
        this.gameArchive = gameArchive;
        this.gameCreationService = gameCreationService;
        this.dispatcher = dispatcher;
    }

    @Override
    public EventResult<ServerEvent> handle(
            Principal principal,
            UUID gameId,
            ClientAction event
    ) {
        Game game = activeGames.getActive(gameId);

        synchronized (game) {
            EventResult<ServerEvent> result = dispatcher.dispatch(game, event, principal);

            if (game.getCurrentPhase() == GamePhase.GAME_OVER) {
                gameArchive.archive(game);
                activeGames.unregister(gameId);
            }

            return result;
        }
    }

    @Override
    public void createGame(UUID id) {
        Game game = gameCreationService.createGame(id);
        activeGames.register(game);
    }
}