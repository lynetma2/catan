package com.sundtrack.catan.lobby.dto.mapper;

import com.sundtrack.catan.lobby.domain.Lobby;
import com.sundtrack.catan.lobby.domain.LobbyPlayer;
import com.sundtrack.catan.lobby.dto.LobbyPlayerSnapshotDTO;
import com.sundtrack.catan.lobby.dto.LobbySnapshotDTO;
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