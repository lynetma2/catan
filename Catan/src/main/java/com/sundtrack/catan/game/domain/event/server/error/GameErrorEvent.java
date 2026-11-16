package com.sundtrack.catan.game.domain.event.server.error;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.util.Map;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + "error")
public record GameErrorEvent(
        String errorCode,
        String message,
        Map<String, Object> details
) implements ServerEvent {
}
