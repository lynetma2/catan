package com.sundtrack.catan.datalayer.domain.event.game.server.error;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

import java.util.Map;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;
import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.SEPARATOR;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + "dice" + SEPARATOR + "roll")
public record GameErrorEvent(
        String errorCode,
        String message,
        Map<String, Object> details
) implements ServerEvent {
}
