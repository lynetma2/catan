package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.datalayer.dto.snapshot.LobbySnapshotDTO;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + LOBBY + SEPARATOR + "state")
public record LobbyStateEvent(
        UUID lobbyId,
        LobbySnapshotDTO snapshot,
        UUID localPlayerId
) implements ServerEvent {
}