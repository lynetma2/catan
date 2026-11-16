package com.sundtrack.catan.datalayer.domain.event.game.server.resource;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.resource.Resource;

import java.util.List;
import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + RESOURCE + SEPARATOR + "grant")
public record ResourceGrantEvent(
        UUID playerId,
        List<Resource> resources
) implements ServerEvent {
}
