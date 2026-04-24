package com.sundtrack.catan.session.game.datalayer.dao;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sundtrack.catan.session.game.datalayer.dao.interfaces.GameSnapshotDAO;
import com.sundtrack.catan.session.game.datalayer.dto.snapshot.GameSnapshotDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Repository
public class GameSnapshotDAOImpl implements GameSnapshotDAO {

    private final Path basePath;
    private final ObjectMapper objectMapper;

    public GameSnapshotDAOImpl(@Value("${game-snapshot.base-path}") String basePath, ObjectMapper objectMapper) throws IOException {
        this.basePath = Paths.get(basePath);
        this.objectMapper = objectMapper;
        Files.createDirectories(this.basePath);
    }

    @Override
    public Path save(String name, GameSnapshotDTO gameSnapshotDTO) throws IOException {
        Path path = resolvePath(name);
        objectMapper.writeValue(path.toFile(), gameSnapshotDTO);
        return path;
    }

    @Override
    public GameSnapshotDTO load(String name) throws IOException {
        Path path = resolvePath(name);
        return objectMapper.readValue(path.toFile(), GameSnapshotDTO.class);
    }

    @Override
    public List<String> listNames() throws IOException {
        try (var stream = Files.list(basePath)) {
            return stream
                    .filter(p -> p.toString().endsWith(".json"))
                    .map(p -> p.getFileName().toString().replace(".json", ""))
                    .toList();
        }
    }

    @Override
    public boolean exists(String name) {
        return resolvePath(name).toFile().exists();
    }

    @Override
    public void delete(String name) throws IOException {
        Files.deleteIfExists(resolvePath(name));
    }

    private Path resolvePath(String name) {
        return basePath.resolve(name + ".json");
    }
}
