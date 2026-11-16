package com.sundtrack.catan.datalayer.domain.event.game.server.overview;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + STATE + SEPARATOR + OVERVIEW + SEPARATOR + "armySize" + SEPARATOR + "change")
public record ArmySizeChangedEvent(
        UUID playerId,
        int armySize
) implements ServerEvent {
}
