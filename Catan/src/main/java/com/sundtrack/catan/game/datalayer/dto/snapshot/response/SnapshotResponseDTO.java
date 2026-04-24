package com.sundtrack.catan.game.datalayer.dto.snapshot.response;

import com.sundtrack.catan.game.datalayer.dto.snapshot.GameSnapshotDTO;

public record SnapshotResponseDTO<T>(String name, T snapshotDTO) {}