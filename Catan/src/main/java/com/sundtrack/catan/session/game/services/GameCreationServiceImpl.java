package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.datalayer.domain.game.GamePlayer;
import com.sundtrack.catan.session.game.services.interfaces.GameCreationService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GameCreationServiceImpl implements GameCreationService {

    @Override
    public Game createGame(Set<UUID> playerIds) {
        List<GamePlayer> gamePlayers = createPlayers(playerIds);

        return new Game(
                gamePlayers,
                new ArrayList<>(),
                new ArrayList<>(),
                GamePhase.SETUP_PLACE_SETTLEMENT,
                0,
                new ArrayList<>(),
                new ArrayList<>(),
                gamePlayers.getFirst().getId()
        );
    }

    private List<GamePlayer> createPlayers(Set<UUID> playerIds) {
        // 1. Define a pool of standard Catan colors (Red, Blue, White, Orange, Green, Brown)
        List<String> colorPool = new ArrayList<>(List.of(
                "#E63946", // Red
                "#457B9D", // Blue
                "#F1FAEE", // White
                "#FB8500", // Orange
                "#2A9D8F", // Green
                "#7B3F00"  // Brown
        ));

        // 2. Shuffle the colors so player order doesn't dictate color every time
        Collections.shuffle(colorPool);

        List<GamePlayer> gamePlayers = new ArrayList<>();
        int count = 1;

        for (UUID id : playerIds) {
            String username = "p" + count;
            // Pick a color from the pool, wrap around if there are more players than colors
            String color = colorPool.get((count - 1) % colorPool.size());

            gamePlayers.add(new GamePlayer(
                    id,
                    username,
                    color,
                    new ArrayList<>(), // resources
                    new ArrayList<>(), // developmentCards
                    0,                 // victoryPoints
                    0,                 // cardCount
                    0,                 // developmentCardCount
                    false,             // hasLongestRoad
                    false,             // hasLargestArmy
                    0                  // robbersUsed
            ));
            count++;
        }

        return gamePlayers;
    }
}
