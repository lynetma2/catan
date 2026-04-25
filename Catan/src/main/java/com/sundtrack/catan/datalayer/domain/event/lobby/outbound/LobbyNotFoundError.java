package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

import java.util.UUID;

public record LobbyNotFoundError(
        UUID lobbyId
) implements OutboundLobbyEvent {

    @Override
    public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.LOBBY_NOT_FOUND;
    }
}
