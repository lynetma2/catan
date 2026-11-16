package com.sundtrack.catan.game.domain.event.action.resource;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;

import java.util.List;
import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + RESOURCE + SEPARATOR + "discard")
public record GameDiscardAction(
        List<UUID> discardedResources
) implements ClientAction {
}
