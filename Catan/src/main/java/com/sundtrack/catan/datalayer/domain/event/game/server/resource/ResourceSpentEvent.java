package com.sundtrack.catan.datalayer.domain.event.game.server.resource;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.resource.Resource;

import java.util.List;
import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + RESOURCE + SEPARATOR + "spent")
public record ResourceSpentEvent(
        UUID playerId,
        List<Resource> resources
) implements ServerEvent {
}
