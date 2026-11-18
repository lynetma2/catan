package com.sundtrack.catan.game.web;

import com.sundtrack.catan.game.application.port.GameQueryPort;
import com.sundtrack.catan.game.application.port.GameStorePort;
import com.sundtrack.catan.game.dto.stats.OverallGameStatsDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/games")
public class GameStatsController {

    private final GameStorePort gameStore;
    private final GameQueryPort gameQuery;

    public GameStatsController(GameStorePort gameStore, GameQueryPort gameQuery) {
        this.gameStore = gameStore;
        this.gameQuery = gameQuery;
    }

    @GetMapping("/stats")
    public OverallGameStatsDTO getStats() {
        return new OverallGameStatsDTO(gameStore.countActive(), gameQuery.countFinished());
    }
}