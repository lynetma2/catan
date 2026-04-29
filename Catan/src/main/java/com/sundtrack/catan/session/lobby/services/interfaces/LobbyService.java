package com.sundtrack.catan.session.lobby.services.interfaces;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.lobby.inbound.InboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.OutboundLobbyEvent;

import java.util.UUID;

public interface LobbyService {
    EventResult<OutboundLobbyEvent> handle(UUID lobbyId, InboundLobbyEvent event);
    EventResult<OutboundLobbyEvent> handleDisconnect(UUID lobbyId, UUID playerId);
}
