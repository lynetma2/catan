package com.sundtrack.catan.session.game.datalayer.dao.interfaces;

import com.sundtrack.catan.session.game.datalayer.dto.snapshot.GameSnapshotDTO;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

public interface GameSnapshotDAO {

    Path save(String name, GameSnapshotDTO gameSnapshotDTO) throws IOException;

    GameSnapshotDTO load(String name) throws IOException;

    List<String> listNames() throws IOException;

    boolean exists(String name);

    void delete(String name) throws IOException;
}
