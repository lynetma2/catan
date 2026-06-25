package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.session.game.eventHandlers.GameContext;

import java.time.Instant;

public record RecordedEvent(
        ClientAction action,
        GameContext gameContext,
        EventResult<ServerEvent> resultingEvents,
        Instant timestamp
) {
}
