package com.sundtrack.catan.datalayer.domain.event.game.server.state;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.game.GamePhase;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + STATE + SEPARATOR + "phase" + SEPARATOR + "change")
public record GamePhaseChangedEvent(
        GamePhase phase
) implements ServerEvent {
}
