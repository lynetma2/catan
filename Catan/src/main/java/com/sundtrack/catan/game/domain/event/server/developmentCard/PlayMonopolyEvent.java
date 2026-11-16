package com.sundtrack.catan.game.domain.event.server.developmentCard;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.resource.ResourceType;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + DEVELOPMENT_CARD + SEPARATOR + PLAY + SEPARATOR + "monopoly")
public record PlayMonopolyEvent(
        ResourceType resourceType,
        UUID playerId
) implements ServerEvent {
}
