package com.sundtrack.catan.datalayer.domain.event.game.action.developmentCard;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + DEVELOPMENT_CARD + SEPARATOR + PLAY + SEPARATOR + "monopoly")
public record PlayMonopolyAction(
        UUID cardId,
        ResourceType resourceType
) implements ClientAction {
}
