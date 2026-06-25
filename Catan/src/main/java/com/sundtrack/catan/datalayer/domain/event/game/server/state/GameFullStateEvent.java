package com.sundtrack.catan.datalayer.domain.event.game.server.state;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.dto.snapshot.GameSnapshotDTO;

import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + STATE + SEPARATOR + "full")
public record GameFullStateEvent(
        UUID lobbyId,
        GameSnapshotDTO snapshot,
        UUID localPlayerId
) implements ServerEvent {
}