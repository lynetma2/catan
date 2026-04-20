package com.sundtrack.catan.game.controllers;

import com.sundtrack.catan.config.ApiRoutes;
import com.sundtrack.catan.game.datalayer.domain.GamePhase;
import com.sundtrack.catan.game.datalayer.dto.snapshot.GameSnapshotDTO;
import com.sundtrack.catan.game.mocks.GameSnapshotFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping(ApiRoutes.GAME_SNAPSHOT_INBOUND) // Matches "/app/game/snapshot"
public class SnapshotController {

    @MessageMapping("/test")
    @SendTo(ApiRoutes.GAME_TOPIC + "/test") // Broadcasts to "/topic/game/test"
    public GameSnapshotDTO getTestSnapshot() {
        return GameSnapshotFactory.createTestGameState(
                2,
                "p1",
                GamePhase.PRE_ROLL
        );
    }

    @MessageMapping("/{gameId}")
    @SendTo(ApiRoutes.GAME_TOPIC + "/{gameId}") // Broadcasts to "/topic/game/123"
    public GameSnapshotDTO getGameSnapshot(@DestinationVariable("gameId") String gameId) {
        return null;
    }
}
