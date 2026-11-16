package com.sundtrack.catan.game.domain.event.server.resource;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.resource.Resource;

import java.util.List;
import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + RESOURCE + SEPARATOR + "spent")
public record ResourceSpentEvent(
        UUID playerId,
        List<Resource> resources
) implements ServerEvent {
}
