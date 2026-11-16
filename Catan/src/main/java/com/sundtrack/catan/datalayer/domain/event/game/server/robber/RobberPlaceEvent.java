package com.sundtrack.catan.datalayer.domain.event.game.server.robber;

import com.sundtrack.catan.datalayer.domain.board.Hex;
import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + ROBBER + SEPARATOR + "place")
public record RobberPlaceEvent(
        Hex hex
) implements ServerEvent {
}
