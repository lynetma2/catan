package com.sundtrack.catan.session.game.services;

import com.sundtrack.catan.common.exceptions.SnapshotAlreadyExistsException;
import com.sundtrack.catan.common.exceptions.SnapshotNotFoundException;
import com.sundtrack.catan.common.exceptions.SnapshotPersistenceException;
import com.sundtrack.catan.datalayer.dao.interfaces.GameSnapshotDAO;
import com.sundtrack.catan.datalayer.dto.snapshot.GameSnapshotDTO;
import com.sundtrack.catan.session.game.services.interfaces.GameSnapshotService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class GameSnapshotServiceImpl implements GameSnapshotService {

    private final GameSnapshotDAO gameSnapshotDAO;

    public GameSnapshotServiceImpl(GameSnapshotDAO gameSnapshotDAO) {
        this.gameSnapshotDAO = gameSnapshotDAO;
    }

    @Override
    public void save(String name, GameSnapshotDTO snapshot) {
        if (gameSnapshotDAO.exists(name)) {
            throw new SnapshotAlreadyExistsException(name);
        }
        try {
            gameSnapshotDAO.save(name, snapshot);
        } catch (IOException e) {
            throw new SnapshotPersistenceException("Failed to save: " + name, e);
        }
    }

    @Override
    public GameSnapshotDTO load(String name) {
        if (!gameSnapshotDAO.exists(name)) {
            throw new SnapshotNotFoundException(name);
        }
        try {
            return gameSnapshotDAO.load(name);
        } catch (IOException e) {
            throw new SnapshotPersistenceException("Failed to load: " + name, e);
        }
    }

    @Override
    public List<String> list() {
        try {
            return gameSnapshotDAO.listNames();
        } catch (IOException e) {
            throw new SnapshotPersistenceException("Failed to list snapshots", e);
        }
    }

    @Override
    public void delete(String name) {
        if (!gameSnapshotDAO.exists(name)) {
            throw new SnapshotNotFoundException(name);
        }
        try {
            gameSnapshotDAO.delete(name);
        } catch (IOException e) {
            throw new SnapshotPersistenceException("Failed to delete: " + name, e);
        }
    }
}
