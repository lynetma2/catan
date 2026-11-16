package com.sundtrack.catan.game.domain.event.server.overview;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + STATE + SEPARATOR + OVERVIEW + SEPARATOR + "resource" + SEPARATOR + "change")
public record ResourceAmountChangedEvent(
        UUID playerId,
        int resourceCards
) implements ServerEvent {
}
