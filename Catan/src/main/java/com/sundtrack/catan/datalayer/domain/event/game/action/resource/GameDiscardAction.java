package com.sundtrack.catan.datalayer.domain.event.game.action.resource;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

import java.util.List;
import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + RESOURCE + SEPARATOR + "discard")
public record GameDiscardAction(
        List<UUID> discardedResources
) implements ServerEvent {
}
