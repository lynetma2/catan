package com.sundtrack.catan.session.shared.dto.response;

public record SnapshotResponseDTO<T>(String name, T snapshotDTO) {}