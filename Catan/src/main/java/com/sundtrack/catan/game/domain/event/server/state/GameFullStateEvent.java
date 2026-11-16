package com.sundtrack.catan.game.domain.event.server.state;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.dto.snapshot.GameSnapshotDTO;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + STATE + SEPARATOR + "full")
public record GameFullStateEvent(
        UUID lobbyId,
        GameSnapshotDTO snapshot,
        UUID localPlayerId
) implements ServerEvent {
}