package com.sundtrack.catan.game.services;

import com.sundtrack.catan.game.datalayer.dto.snapshot.GameSnapshotDTO;
import com.sundtrack.catan.game.services.interfaces.GameSnapshotService;
import org.springframework.stereotype.Service;

@Service
public class GameSnapshotServiceImpl implements GameSnapshotService {

    public static GameSnapshotDTO createTestSnapshot() {

        GameSnapshotDTO snapshotDTO = new GameSnapshotDTO();

        return snapshotDTO;
    }
}
