package com.sundtrack.catan.datalayer.domain.event.game.server.resource;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + RESOURCE + SEPARATOR + "discard")
public record DiscardRequiredEvent(
        UUID playerId,
        int amount
) implements ServerEvent {
}
