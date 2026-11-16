package com.sundtrack.catan.game.web;

import com.sundtrack.catan.game.dto.stats.OverallGameStatsDTO;
import com.sundtrack.catan.game.application.port.ActiveGameRegistry;
import com.sundtrack.catan.game.application.port.GameArchive;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/games")
public class GameStatsController {

    private final ActiveGameRegistry activeGameRegistry;
    private final GameArchive gameArchive;

    public GameStatsController(ActiveGameRegistry activeGameRegistry, GameArchive gameArchive) {
        this.activeGameRegistry = activeGameRegistry;
        this.gameArchive = gameArchive;
    }

    @GetMapping("/stats")
    public OverallGameStatsDTO getStats() {
        return new OverallGameStatsDTO(
                activeGameRegistry.getActiveGameCount(),
                gameArchive.getArchivedGameCount()
        );
    }
}