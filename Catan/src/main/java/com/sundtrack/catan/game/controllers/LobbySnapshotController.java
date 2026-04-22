package com.sundtrack.catan.game.controllers;

import com.sundtrack.catan.config.ApiRoutes;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping(ApiRoutes.LOBBY_SNAPSHOT_INBOUND)
public class LobbySnapshotController {

    @MessageMapping("/test")
    @SendToUser(ApiRoutes.LOBBY_TOPIC + )
    public String getTestLobbySnapshot() {

    }
}
