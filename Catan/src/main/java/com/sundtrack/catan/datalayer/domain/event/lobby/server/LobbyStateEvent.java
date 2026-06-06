package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.dto.snapshot.LobbySnapshotDTO;

import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + LOBBY + SEPARATOR + "state")
public record LobbyStateEvent(
        UUID lobbyId,
        LobbySnapshotDTO snapshot,
        UUID localPlayerId
) implements ServerEvent {
}