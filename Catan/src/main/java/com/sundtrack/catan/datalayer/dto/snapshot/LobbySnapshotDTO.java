package com.sundtrack.catan.datalayer.dto.snapshot;

import java.util.Map;

public record LobbySnapshotDTO(
        String id,
        Map<String, LobbyPlayerSnapshotDTO> players
) {}
