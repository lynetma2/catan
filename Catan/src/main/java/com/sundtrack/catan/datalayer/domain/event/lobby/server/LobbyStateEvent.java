package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEventType;
import com.sundtrack.catan.datalayer.dto.snapshot.LobbySnapshotDTO;

import java.util.UUID;

public record LobbyStateEvent(
        UUID lobbyId,
        LobbySnapshotDTO snapshot,
        UUID localPlayerId
) implements OutboundLobbyEvent {
    @Override
    public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.LOBBY_STATE;
    }
}