package com.sundtrack.catan.session.api.response;

public record SnapshotResponseDTO<T>(String name, T snapshotDTO) {}