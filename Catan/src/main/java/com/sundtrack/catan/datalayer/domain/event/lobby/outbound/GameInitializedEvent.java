package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

import com.sundtrack.catan.datalayer.domain.event.game.outbound.OutboundGameEvent;
import com.sundtrack.catan.datalayer.domain.event.game.outbound.OutboundGameEventType;
import com.sundtrack.catan.datalayer.dto.snapshot.GameSnapshotDTO;

import java.util.UUID;

public record GameInitializedEvent(
) implements OutboundLobbyEvent {
    @Override
    public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.GAME_INITIALIZED;
    }
}
