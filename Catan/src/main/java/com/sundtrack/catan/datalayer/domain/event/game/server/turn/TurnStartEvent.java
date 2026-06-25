package com.sundtrack.catan.datalayer.domain.event.game.server.turn;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + TURN + SEPARATOR + "start")
public record TurnStartEvent(
        UUID playerId
) implements ServerEvent {
}
