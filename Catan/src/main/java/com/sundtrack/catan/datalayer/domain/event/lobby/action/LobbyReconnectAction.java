package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + LOBBY + SEPARATOR + "reconnect")
public record LobbyReconnectAction(
        UUID lobbyId
) implements ClientAction { }
