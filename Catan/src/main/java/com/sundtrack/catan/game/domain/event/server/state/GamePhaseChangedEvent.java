package com.sundtrack.catan.game.domain.event.server.state;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.GamePhase;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + STATE + SEPARATOR + "phase" + SEPARATOR + "change")
public record GamePhaseChangedEvent(
        GamePhase phase
) implements ServerEvent {
}
