package com.sundtrack.catan.datalayer.dto.snapshot;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LobbyPlayerSnapshotDTO(
        String id,
        String username,
        @JsonProperty("isLeader") boolean isLeader,
        @JsonProperty("isReady") boolean isReady
) {
}