package com.sundtrack.catan.lobby.domain.event.server;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.lobby.domain.event.reason.LobbyJoinRejectionReason;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + LOBBY + SEPARATOR + "join" + SEPARATOR + REJECTED)
public record LobbyJoinRejectedEvent(
        LobbyJoinRejectionReason reason
) implements ServerEvent {
}

