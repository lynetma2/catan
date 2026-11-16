package com.sundtrack.catan.lobby.application.port;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.security.Principal;
import java.util.UUID;

public interface LobbyService {
    EventResult<ServerEvent> handle(Principal principal, UUID lobbyId, ClientAction event);

    EventResult<ServerEvent> handleDisconnect(Principal principal, UUID lobbyId);
}
