package com.sundtrack.catan.datalayer.domain.event.game.server.overview;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + STATE + SEPARATOR + OVERVIEW + SEPARATOR + "victoryPoints" + SEPARATOR + "change")
public record VictoryPointsChangedEvent(
        UUID playerId,
        long victoryPoints
) implements ServerEvent {
}
