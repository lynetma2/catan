package com.sundtrack.catan.game.controllers;

import com.sundtrack.catan.config.routes.GameSnapshotRoutes;
import com.sundtrack.catan.game.datalayer.dto.snapshot.GameSnapshotDTO;
import com.sundtrack.catan.game.datalayer.dto.snapshot.request.DeleteSnapshotRequestDTO;
import com.sundtrack.catan.game.datalayer.dto.snapshot.request.LoadSnapshotRequestDTO;
import com.sundtrack.catan.game.datalayer.dto.snapshot.request.SaveSnapshotRequestDTO;
import com.sundtrack.catan.game.datalayer.dto.snapshot.response.AckResponseDTO;
import com.sundtrack.catan.game.datalayer.dto.snapshot.response.SnapshotListResponseDTO;
import com.sundtrack.catan.game.datalayer.dto.snapshot.response.SnapshotResponseDTO;
import com.sundtrack.catan.game.services.interfaces.GameSnapshotService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping({GameSnapshotRoutes.BASE})
public class GameSnapshotController {

    private final GameSnapshotService gameSnapshotService;

    public GameSnapshotController(GameSnapshotService gameSnapshotService) {
        this.gameSnapshotService = gameSnapshotService;
    }

    @MessageMapping(GameSnapshotRoutes.In.PING)
    @SendToUser(GameSnapshotRoutes.Out.PING)
    public String ping() {
        return "ok";
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
