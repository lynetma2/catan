package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.datalayer.domain.board.BoardFactory;
import com.sundtrack.catan.datalayer.domain.board.tile.Tile;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.datalayer.domain.game.GamePlayer;
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

        List<Tile> tiles = boardFactory.createRandom();
        List<GamePlayer> gamePlayers = createPlayers(lobbyPlayers);

        return new Game(
                id,
                gamePlayers,
                tiles,
                new ArrayList<>(),
                GamePhase.SETUP_PLACE_SETTLEMENT,
                0,
                new ArrayList<>(),
                new ArrayList<>(),
                gamePlayers.getFirst().getId()
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
