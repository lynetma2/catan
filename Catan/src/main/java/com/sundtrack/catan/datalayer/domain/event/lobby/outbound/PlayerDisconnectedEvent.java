package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

import com.sundtrack.catan.datalayer.dto.snapshot.GameSnapshotDTO;

import java.util.UUID;

public record PlayerDisconnectedEvent(
        UUID playerId
) implements OutboundLobbyEvent {
    @Override
    public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.PLAYER_DISCONNECTED;
    }
}