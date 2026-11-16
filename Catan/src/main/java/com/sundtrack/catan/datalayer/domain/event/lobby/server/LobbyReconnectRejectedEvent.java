package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.reason.LobbyReconnectRejectionReason;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + LOBBY + SEPARATOR + "reconnect" + SEPARATOR + REJECTED)
public record LobbyReconnectRejectedEvent(
        LobbyReconnectRejectionReason reason
) implements ServerEvent {
}