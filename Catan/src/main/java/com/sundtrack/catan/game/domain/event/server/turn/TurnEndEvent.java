package com.sundtrack.catan.game.domain.event.server.turn;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + TURN + SEPARATOR + "end")
public record TurnEndEvent(
        UUID playerId
) implements ServerEvent {
}
