package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.datalayer.domain.board.Board;
import com.sundtrack.catan.datalayer.domain.board.BoardFactory;
import com.sundtrack.catan.datalayer.domain.game.*;
import com.sundtrack.catan.datalayer.domain.lobby.Lobby;
import com.sundtrack.catan.datalayer.domain.lobby.LobbyPlayer;
import com.sundtrack.catan.session.game.services.interfaces.GameCreationService;
import com.sundtrack.catan.session.lobby.services.LobbyStore;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GameCreationServiceImpl implements GameCreationService {

    private final BoardFactory boardFactory;
    private final LobbyStore lobbyStore;

    public GameCreationServiceImpl(BoardFactory boardFactory, LobbyStore lobbyStore) {
        this.boardFactory = boardFactory;
        this.lobbyStore = lobbyStore;
    }

    @Override
    public Game createGame(UUID id) {
        Lobby lobby = lobbyStore.get(id);
        Map<UUID, LobbyPlayer> lobbyPlayers = lobby.getPlayers();

        Board board = boardFactory.createRandom();
        List<GamePlayer> gamePlayers = createPlayers(lobbyPlayers);
        TurnOrder turnOrder = TurnOrder.startingNewGame(lobbyPlayers.keySet().stream().toList());
        DicePair dicePair = new DicePair();
        GameFlow flow = new GameFlow(GamePhase.SETUP_PLACE_SETTLEMENT, turnOrder, 0);

        return new Game(
                id,
                gamePlayers,
                board,
                flow,
                new ArrayList<>(),
                new ArrayList<>(),
                dicePair
        );
    }

    private List<GamePlayer> createPlayers(Map<UUID, LobbyPlayer> lobbyPlayers) {
        List<String> colorPool = new ArrayList<>(List.of(
                "#E63946", "#457B9D", "#F1FAEE", "#FB8500", "#2A9D8F", "#7B3F00"
        ));
        Collections.shuffle(colorPool);

        List<GamePlayer> gamePlayers = new ArrayList<>();
        int count = 0;

        for (LobbyPlayer lobbyPlayer : lobbyPlayers.values()) {
            gamePlayers.add(new GamePlayer(
                    lobbyPlayer.getId(),
                    lobbyPlayer.getUsername(),
                    colorPool.get(count % colorPool.size()),
                    new ArrayList<>(),
                    new ArrayList<>(),
                    0, 0, 0, false, false, 0
            ));
            count++;
        }

        return gamePlayers;
    }
}
