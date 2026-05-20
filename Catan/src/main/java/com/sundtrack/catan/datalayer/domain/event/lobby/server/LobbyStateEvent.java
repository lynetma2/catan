package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.dto.snapshot.LobbySnapshotDTO;
import java.util.UUID;

public record LobbyStateEvent(
        UUID lobbyId,
        LobbySnapshotDTO snapshot,
        UUID localPlayerId
) implements LobbyServerEvent {
    @Override
    public String event() {
        return "state";
    }
}