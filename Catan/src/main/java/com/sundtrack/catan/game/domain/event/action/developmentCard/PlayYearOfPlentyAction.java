package com.sundtrack.catan.game.domain.event.action.developmentCard;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.game.domain.resource.ResourceType;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + DEVELOPMENT_CARD + SEPARATOR + PLAY + SEPARATOR + "yearOfPlenty")
public record PlayYearOfPlentyAction(
        UUID cardId,
        ResourceType firstResource,
        ResourceType secondResource
) implements ClientAction {
}
