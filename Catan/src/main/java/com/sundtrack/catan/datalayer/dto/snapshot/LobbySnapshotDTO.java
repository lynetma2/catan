package com.sundtrack.catan.datalayer.dto.snapshot;

import com.sundtrack.catan.datalayer.domain.lobby.LobbyPlayer;

import java.util.Map;

public record LobbySnapshotDTO(
        String id,
        Map<String, LobbyPlayer> players
) {}
