package com.sundtrack.catan.datalayer.domain.event.game.action.developmentCard;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;
import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.DEVELOPMENT_CARD;
import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.PLAY;
import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.REJECTED;
import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.SEPARATOR;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + DEVELOPMENT_CARD + SEPARATOR + PLAY + SEPARATOR + REJECTED + SEPARATOR + "yearOfPlenty")
public record PlayYearOfPlentyAction(
        UUID cardId,
        ResourceType firstResource,
        ResourceType secondResource
) implements ClientAction {
}
