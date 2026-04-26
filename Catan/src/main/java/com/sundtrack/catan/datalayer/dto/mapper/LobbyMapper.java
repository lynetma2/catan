package com.sundtrack.catan.datalayer.dto.mapper;

import com.sundtrack.catan.datalayer.domain.lobby.Lobby;
import com.sundtrack.catan.datalayer.domain.lobby.LobbyPlayer;
import com.sundtrack.catan.datalayer.dto.snapshot.LobbyPlayerSnapshotDTO;
import com.sundtrack.catan.datalayer.dto.snapshot.LobbySnapshotDTO;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class LobbyMapper {

    public LobbySnapshotDTO toSnapshotDTO(Lobby lobby) {
        return new LobbySnapshotDTO(
                lobby.getId().toString(),
                mapPlayers(lobby.getPlayers())
        );
    }

    private Map<String, LobbyPlayerSnapshotDTO> mapPlayers(Map<UUID, LobbyPlayer> players) {
        return players.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().toString(),
                        entry -> mapPlayer(entry.getValue())
                ));
    }

    private LobbyPlayerSnapshotDTO mapPlayer(LobbyPlayer player) {
        return new LobbyPlayerSnapshotDTO(
                player.getId().toString(),
                player.getUsername(),
                player.isLeader(),
                player.isReady()
        );
    }
}