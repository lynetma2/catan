package com.sundtrack.catan.session.game.controllers;

import com.sundtrack.catan.config.routes.GameSnapshotRoutes;
import com.sundtrack.catan.datalayer.dto.PingResponseDTO;
import com.sundtrack.catan.datalayer.dto.snapshot.GameSnapshotDTO;
import com.sundtrack.catan.session.shared.dto.request.DeleteSnapshotRequestDTO;
import com.sundtrack.catan.session.shared.dto.request.LoadSnapshotRequestDTO;
import com.sundtrack.catan.session.shared.dto.request.SaveSnapshotRequestDTO;
import com.sundtrack.catan.session.shared.dto.response.AckResponseDTO;
import com.sundtrack.catan.session.shared.dto.response.SnapshotListResponseDTO;
import com.sundtrack.catan.session.shared.dto.response.SnapshotResponseDTO;
import com.sundtrack.catan.session.game.services.interfaces.GameSnapshotService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Controller
@MessageMapping({GameSnapshotRoutes.BASE})
public class GameSnapshotController {

    private final GameSnapshotService gameSnapshotService;

    public GameSnapshotController(GameSnapshotService gameSnapshotService) {
        this.gameSnapshotService = gameSnapshotService;
    }

    @MessageMapping(GameSnapshotRoutes.In.PING)
    @SendToUser(GameSnapshotRoutes.Out.PING)
    public PingResponseDTO ping() {
        return new PingResponseDTO("ok", LocalDateTime.now());
    }

    @MessageMapping(GameSnapshotRoutes.In.SAVE)
    @SendToUser(GameSnapshotRoutes.Out.SAVE)
    public AckResponseDTO saveSnapshot(SaveSnapshotRequestDTO<GameSnapshotDTO> request) {
        gameSnapshotService.save(request.name(), request.snapshot());
        return new AckResponseDTO("saved", request.name());
    }

    @MessageMapping(GameSnapshotRoutes.In.LOAD)
    @SendToUser(GameSnapshotRoutes.Out.LOAD)
    public SnapshotResponseDTO<GameSnapshotDTO> loadSnapshot(LoadSnapshotRequestDTO request) {
        GameSnapshotDTO snapshot = gameSnapshotService.load(request.name());
        return new SnapshotResponseDTO<>(request.name(), snapshot);
    }

    @MessageMapping(GameSnapshotRoutes.In.LIST)
    @SendToUser(GameSnapshotRoutes.Out.LIST)
    public SnapshotListResponseDTO listSnapshots() {
        return new SnapshotListResponseDTO(gameSnapshotService.list());
    }

    @MessageMapping(GameSnapshotRoutes.In.DELETE)
    @SendToUser(GameSnapshotRoutes.Out.DELETE)
    public AckResponseDTO deleteSnapshot(DeleteSnapshotRequestDTO request) {
        gameSnapshotService.delete(request.name());
        return new AckResponseDTO("deleted", request.name());
    }
}
