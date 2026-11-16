package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

import java.time.Instant;
import java.util.UUID;

public record RecordedEvent(
        ClientAction action,
        UUID playerId,
        EventResult<ServerEvent> resultingEvents,
        Instant timestamp
) {
}
