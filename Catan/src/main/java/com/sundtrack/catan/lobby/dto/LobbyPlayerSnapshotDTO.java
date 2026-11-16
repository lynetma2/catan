package com.sundtrack.catan.lobby.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LobbyPlayerSnapshotDTO(
        String id,
        String username,
        @JsonProperty("isLeader") boolean isLeader,
        @JsonProperty("isReady") boolean isReady
) {
}