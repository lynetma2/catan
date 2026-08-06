package com.sundtrack.catan.datalayer.domain.event.game.server.error;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

import java.util.Map;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + "error")
public record GameErrorEvent(
        String errorCode,
        String message,
        Map<String, Object> details
) implements ServerEvent {
}
