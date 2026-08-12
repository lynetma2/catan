package com.sundtrack.catan.session.game.controllers;

import com.sundtrack.catan.datalayer.dto.stats.OverallGameStatsDTO;
import com.sundtrack.catan.session.game.services.interfaces.ActiveGameRegistry;
import com.sundtrack.catan.session.game.services.interfaces.GameArchive;
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