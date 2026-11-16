package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + LOBBY + SEPARATOR + PLAYER + SEPARATOR + "ready")
public record PlayerReadyEvent(
        UUID playerId
) implements ServerEvent {
}

