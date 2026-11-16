package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.shared.util.PrincipalUtils;
import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.messaging.game.GameDispatcher;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;
import com.sundtrack.catan.session.game.services.interfaces.ActiveGameRegistry;
import com.sundtrack.catan.session.game.services.interfaces.GameArchive;
import com.sundtrack.catan.session.game.services.interfaces.GameCreationService;
import com.sundtrack.catan.session.game.services.interfaces.GameService;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;
import java.util.UUID;

@Service
public class GameServiceImpl implements GameService {

    private final ActiveGameRegistry activeGames;
    private final GameArchive gameArchive;
    private final GameCreationService gameCreationService;
    private final GameDispatcher dispatcher;

    public GameServiceImpl(
            ActiveGameRegistry activeGames,
            GameArchive gameArchive,
            GameCreationService gameCreationService,
            GameDispatcher gameDispatcher
    ) {
        this.activeGames = activeGames;
        this.gameArchive = gameArchive;
        this.gameCreationService = gameCreationService;
        this.dispatcher = gameDispatcher;
    }

    @Override
    public EventResult<ServerEvent> handle(Principal principal, UUID gameId, ClientAction action) {
        UUID playerId = PrincipalUtils.extractPlayerId(principal);
        GameContext context = new GameContext(principal, playerId, gameId);

        Optional<Game> active = activeGames.findActive(gameId);
        if (active.isEmpty()) {
            return dispatcher.dispatch(context, action);   // finished-game read path (EndSummary)
        }
        Game game = active.get();
        synchronized (game) {
            EventResult<ServerEvent> result = dispatcher.dispatch(context, action);
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