package com.sundtrack.catan.datalayer.dto.snapshot;

import java.util.UUID;

public record LobbyPlayerSnapshotDTO(
        String id,
        String username,
        boolean isLeader,
        boolean isReady
) {}