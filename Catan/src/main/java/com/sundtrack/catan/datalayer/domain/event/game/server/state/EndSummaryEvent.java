package com.sundtrack.catan.datalayer.domain.event.game.server.state;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.dto.snapshot.EndSummaryDTO;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + STATE + SEPARATOR + "end")
public record EndSummaryEvent(
        EndSummaryDTO endSummary
) implements ServerEvent {
}
