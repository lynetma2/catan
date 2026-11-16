package com.sundtrack.catan.game.domain.event.server.state;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.dto.snapshot.EndSummaryDTO;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + STATE + SEPARATOR + "end")
public record EndSummaryEvent(
        EndSummaryDTO endSummary
) implements ServerEvent {
}
