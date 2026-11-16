package com.sundtrack.catan.game.domain;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.time.Instant;
import java.util.UUID;

public record RecordedEvent(
        ClientAction action,
        UUID playerId,
        EventResult<ServerEvent> resultingEvents,
        Instant timestamp
) {
}
