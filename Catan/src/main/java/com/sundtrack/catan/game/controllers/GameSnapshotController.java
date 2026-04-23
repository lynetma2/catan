package com.sundtrack.catan.game.controllers;

import com.sundtrack.catan.config.routes.ApiRoutes;
import com.sundtrack.catan.config.routes.GameSnapshotRoutes;
import com.sundtrack.catan.config.routes.LobbySnapshotRoutes;
import com.sundtrack.catan.game.datalayer.domain.GamePhase;
import com.sundtrack.catan.game.datalayer.dto.GameMessageType;
import com.sundtrack.catan.game.datalayer.dto.GameMessageWrapperDTO;
import com.sundtrack.catan.game.datalayer.dto.snapshot.GameSnapshotDTO;
import com.sundtrack.catan.game.mocks.GameSnapshotFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping({GameSnapshotRoutes.BASE})
public class GameSnapshotController {

//    @MessageMapping("/test")
//    @SendTo(ApiRoutes.GAME_TOPIC + "/test") // Broadcasts to "/topic/game/test"
//    public GameMessageWrapperDTO<GameSnapshotDTO> getTestGameSnapshot() {
//        System.out.println("Got a request test game snapshot message");
//        return new GameMessageWrapperDTO<GameSnapshotDTO>(GameMessageType.GAME_STATE_LOADED,GameSnapshotFactory.createTestGameState(
//                2,
//                "p1",
//                GamePhase.PRE_ROLL
//        ));
//    }
//
//    @MessageMapping("/{gameId}")
//    @SendTo(ApiRoutes.GAME_TOPIC + "/{gameId}") // Broadcasts to "/topic/game/123"
//    public GameSnapshotDTO getGameSnapshot(@DestinationVariable("gameId") String gameId) {
//        return null;
//    }

    @MessageMapping(GameSnapshotRoutes.In.PING)
    @SendToUser(GameSnapshotRoutes.Out.PING)
    public String ping() {

    }

    @MessageMapping(GameSnapshotRoutes.In.SAVE)
    @SendToUser(GameSnapshotRoutes.Out.SAVE)
    public AckResponse saveSnapshot(SaveSnapshotRequest request) {

    }

    @MessageMapping(GameSnapshotRoutes.In.LOAD)
    @SendToUser(GameSnapshotRoutes.Out.LOAD)
    public SnapshotResponse loadSnapshot(LoadSnapshotRequest request) {

    }

    @MessageMapping(GameSnapshotRoutes.In.LIST)
    @SendToUser(GameSnapshotRoutes.Out.LIST)
    public SnapshotListResponse listSnapshots() {

    }

    @MessageMapping(GameSnapshotRoutes.In.DELETE)
    @SendToUser(GameSnapshotRoutes.Out.DELETE)
    public AckResponse deleteSnapshot(DeleteSnapshotRequest request) {

    }
}
