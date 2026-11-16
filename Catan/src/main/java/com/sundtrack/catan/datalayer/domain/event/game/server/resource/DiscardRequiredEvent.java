package com.sundtrack.catan.datalayer.domain.event.game.server.resource;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + RESOURCE + SEPARATOR + "discardRequired")
public record DiscardRequiredEvent(
        UUID playerId,
        int amount
) implements ServerEvent {
}
