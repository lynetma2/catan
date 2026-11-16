package com.sundtrack.catan.lobby.domain.event.server;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.lobby.dto.LobbySnapshotDTO;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + LOBBY + SEPARATOR + "state")
public record LobbyStateEvent(
        UUID lobbyId,
        LobbySnapshotDTO snapshot,
        UUID localPlayerId
) implements ServerEvent {
}