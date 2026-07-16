package com.sundtrack.catan.datalayer.domain.event.game.server.overview;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + STATE + SEPARATOR + OVERVIEW + SEPARATOR + "armySize" + SEPARATOR + "change")
public record ArmySizeChangedEvent(
        UUID playerId,
        int armySize
) implements ServerEvent {
}
