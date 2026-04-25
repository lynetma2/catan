package com.sundtrack.catan.datalayer.dto.snapshot;

import com.sundtrack.catan.datalayer.domain.lobby.Lobby;

import java.util.Map;

public record LobbySnapshotDTO(
        String id,
        Map<String, Lobby.LobbyPlayer> players
) {}
