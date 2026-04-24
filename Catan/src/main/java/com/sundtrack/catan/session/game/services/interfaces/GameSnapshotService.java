package com.sundtrack.catan.session.game.services.interfaces;

import com.sundtrack.catan.session.game.datalayer.dto.snapshot.GameSnapshotDTO;
import java.util.List;

public interface GameSnapshotService {
    void save(String name, GameSnapshotDTO snapshot);
    GameSnapshotDTO load(String name);
    List<String> list();
    void delete(String name);
}
