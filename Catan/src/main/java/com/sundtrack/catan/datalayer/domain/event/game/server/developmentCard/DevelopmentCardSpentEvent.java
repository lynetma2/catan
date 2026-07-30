package com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + DEVELOPMENT_CARD + SEPARATOR + "spent")
public record DevelopmentCardSpentEvent(
        UUID playerId,
        UUID cardId
) implements ServerEvent {
}
