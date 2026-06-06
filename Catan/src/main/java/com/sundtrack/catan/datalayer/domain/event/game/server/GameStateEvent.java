package com.sundtrack.catan.datalayer.domain.event.game.server;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.dto.snapshot.GameSnapshotDTO;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + "state")
public record GameStateEvent(
        GameSnapshotDTO payload
) implements ServerEvent {
}