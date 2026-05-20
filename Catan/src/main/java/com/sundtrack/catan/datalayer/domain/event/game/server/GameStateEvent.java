package com.sundtrack.catan.datalayer.domain.event.game.server;

import com.sundtrack.catan.datalayer.dto.snapshot.GameSnapshotDTO;

public record GameStateEvent(
        GameSnapshotDTO payload
) implements GameServerEvent {
    @Override
    public String event() {
        return "state";
    }
}