package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

import com.sundtrack.catan.datalayer.domain.lobby.LobbyPlayer;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public record LobbyStateEvent(
        UUID lobbyId,
        Map<UUID, LobbyPlayer> players
) implements OutboundLobbyEvent {
    @Override
    public OutboundLobbyEventType type() {
        return OutboundLobbyEventType.LOBBY_STATE;
    }
}
