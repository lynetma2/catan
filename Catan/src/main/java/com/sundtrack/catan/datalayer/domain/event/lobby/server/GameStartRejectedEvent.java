package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.reason.GameStartRejectionReason;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + LOBBY + SEPARATOR + "start" + SEPARATOR + REJECTED)
public record GameStartRejectedEvent(
        GameStartRejectionReason reason
) implements ServerEvent {
}

