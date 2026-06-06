package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.reason.LobbyJoinRejectionReason;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + LOBBY + SEPARATOR + "join" + SEPARATOR + REJECTED)
public record LobbyJoinRejectedEvent(
        LobbyJoinRejectionReason reason
) implements ServerEvent {
}

