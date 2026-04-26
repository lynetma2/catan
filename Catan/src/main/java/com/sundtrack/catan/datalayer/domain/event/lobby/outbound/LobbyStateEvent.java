package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

import com.sundtrack.catan.datalayer.dto.snapshot.LobbySnapshotDTO;

import java.util.UUID;

public record LobbyStateEvent(
        UUID lobbyId,
        LobbySnapshotDTO snapshot
) implements OutboundLobbyEvent {
    @Override public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.LOBBY_STATE;
    }
}