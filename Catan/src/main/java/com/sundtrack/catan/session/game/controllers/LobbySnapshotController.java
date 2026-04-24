//package com.sundtrack.catan.session.game.controllers;
//
//import com.sundtrack.catan.config.routes.ApiRoutes;
//import com.sundtrack.catan.config.routes.LobbySnapshotRoutes;
//import com.sundtrack.catan.datalayer.dto.snapshot.LobbySnapshotDTO;
//import com.sundtrack.catan.session.shared.dto.request.DeleteSnapshotRequestDTO;
//import com.sundtrack.catan.session.shared.dto.request.LoadSnapshotRequestDTO;
//import com.sundtrack.catan.session.shared.dto.request.SaveSnapshotRequestDTO;
//import com.sundtrack.catan.session.shared.dto.response.AckResponseDTO;
//import com.sundtrack.catan.session.shared.dto.response.SnapshotListResponseDTO;
//import com.sundtrack.catan.session.shared.dto.response.SnapshotResponseDTO;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.annotation.SendToUser;
//import org.springframework.stereotype.Controller;
//
//@Controller
//@MessageMapping(LobbySnapshotRoutes.BASE)
//public class LobbySnapshotController {
//
//    @MessageMapping(LobbySnapshotRoutes.In.PING)
//    @SendToUser(LobbySnapshotRoutes.Out.PING)
//    public String ping() {
//
//    }
//
//    @MessageMapping(LobbySnapshotRoutes.In.SAVE)
//    @SendToUser(LobbySnapshotRoutes.Out.SAVE)
//    public AckResponseDTO saveSnapshot(SaveSnapshotRequestDTO<LobbySnapshotDTO> request) {
//
//    }
//
//    @MessageMapping(LobbySnapshotRoutes.In.LOAD)
//    @SendToUser(LobbySnapshotRoutes.Out.LOAD)
//    public SnapshotResponseDTO<LobbySnapshotDTO> loadSnapshot(LoadSnapshotRequestDTO request) {
//
//    }
//
//    @MessageMapping(LobbySnapshotRoutes.In.LIST)
//    @SendToUser(LobbySnapshotRoutes.Out.LIST)
//    public SnapshotListResponseDTO listSnapshots() {
//
//    }
//
//    @MessageMapping(LobbySnapshotRoutes.In.DELETE)
//    @SendToUser(LobbySnapshotRoutes.Out.DELETE)
//    public AckResponseDTO deleteSnapshot(DeleteSnapshotRequestDTO request) {
//
//    }
//}
