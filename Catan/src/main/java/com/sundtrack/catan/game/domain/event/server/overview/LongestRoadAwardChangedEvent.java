package com.sundtrack.catan.game.domain.event.server.overview;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + STATE + SEPARATOR + OVERVIEW + SEPARATOR + "longestRoad" + SEPARATOR + "change")
public record LongestRoadAwardChangedEvent(
        UUID playerId,
        boolean hasLongestRoad
) implements ServerEvent {
}
