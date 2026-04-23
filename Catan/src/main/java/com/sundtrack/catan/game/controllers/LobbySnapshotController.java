package com.sundtrack.catan.game.controllers;

import com.sundtrack.catan.config.routes.ApiRoutes;
import com.sundtrack.catan.config.routes.LobbySnapshotRoutes;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping(LobbySnapshotRoutes.BASE)
public class LobbySnapshotController {

    @MessageMapping(LobbySnapshotRoutes.In.PING)
    @SendToUser(LobbySnapshotRoutes.Out.PING)
    public String ping() {

    }

    @MessageMapping(LobbySnapshotRoutes.In.SAVE)
    @SendToUser(LobbySnapshotRoutes.Out.SAVE)
    public AckResponse saveSnapshot(SaveSnapshotRequest request) {

    }

    @MessageMapping(LobbySnapshotRoutes.In.LOAD)
    @SendToUser(LobbySnapshotRoutes.Out.LOAD)
    public SnapshotResponse loadSnapshot(LoadSnapshotRequest request) {

    }

    @MessageMapping(LobbySnapshotRoutes.In.LIST)
    @SendToUser(LobbySnapshotRoutes.Out.LIST)
    public SnapshotListResponse listSnapshots() {

    }

    @MessageMapping(LobbySnapshotRoutes.In.DELETE)
    @SendToUser(LobbySnapshotRoutes.Out.DELETE)
    public AckResponse deleteSnapshot(DeleteSnapshotRequest request) {

    }
}
