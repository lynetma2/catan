package com.sundtrack.catan.game.domain.event.server.developmentCard;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + DEVELOPMENT_CARD + SEPARATOR + PLAY + SEPARATOR + REJECTED + SEPARATOR + "knight")
public record PlayKnightEvent(
        UUID playerId
) implements ServerEvent {
}
