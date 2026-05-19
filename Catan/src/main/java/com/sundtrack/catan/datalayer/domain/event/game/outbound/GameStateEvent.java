package com.sundtrack.catan.datalayer.domain.event.game.outbound;

import com.sundtrack.catan.datalayer.dto.snapshot.GameSnapshotDTO;

public record GameStateEvent(
        GameSnapshotDTO payload
) implements ServerGameEvent {
    @Override
    public OutboundGameEventType type() {
        return OutboundGameEventType.GAME_STATE_LOADED;
    }
}