package com.sundtrack.catan.session.lobby.services.interfaces;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.lobby.action.LobbyClientAction;
import com.sundtrack.catan.datalayer.domain.event.lobby.server.LobbyServerEvent;

import java.security.Principal;
import java.util.UUID;

public interface LobbyService {
    EventResult<LobbyServerEvent> handle(Principal principal, UUID lobbyId, LobbyClientAction event);
    EventResult<LobbyServerEvent> handleDisconnect(Principal principal, UUID lobbyId);
}
