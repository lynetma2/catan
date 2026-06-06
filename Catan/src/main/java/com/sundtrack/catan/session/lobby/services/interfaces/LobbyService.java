package com.sundtrack.catan.session.lobby.services.interfaces;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

import java.security.Principal;
import java.util.UUID;

public interface LobbyService {
    EventResult<ServerEvent> handle(Principal principal, UUID lobbyId, ClientAction event);

    EventResult<ServerEvent> handleDisconnect(Principal principal, UUID lobbyId);
}
