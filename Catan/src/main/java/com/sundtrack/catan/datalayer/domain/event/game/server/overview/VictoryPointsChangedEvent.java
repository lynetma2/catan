package com.sundtrack.catan.datalayer.domain.event.game.server.overview;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + STATE + SEPARATOR + OVERVIEW + SEPARATOR + "victoryPoints" + SEPARATOR + "change")
public record VictoryPointsChangedEvent(
        UUID playerId,
        long victoryPoints
) implements ServerEvent {
}
