package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.sundtrack.catan.datalayer.domain.event.lobby.inbound.InboundLobbyEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.inbound.InboundLobbyEventType;

public record LobbyCreateAction(
        String playerName
) implements LobbyClientAction {
    @Override
    public InboundLobbyEventType type() {
        return InboundLobbyEventType.LOBBY_CREATE_REQUESTED;
    }
}