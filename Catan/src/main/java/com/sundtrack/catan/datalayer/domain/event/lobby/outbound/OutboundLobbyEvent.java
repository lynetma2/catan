package com.sundtrack.catan.datalayer.domain.event.lobby.outbound;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.sundtrack.catan.datalayer.domain.event.OutboundEvent;

public sealed interface OutboundLobbyEvent extends OutboundEvent permits GameInitializedEvent, GameStartRejectedEvent, LobbyJoinRejectedEvent, LobbyNotFoundError, LobbyReconnectRejectionEvent, LobbyStateEvent, PlayerDisconnectedEvent, PlayerJoinedLobbyEvent, PlayerReadyEvent, PlayerUnreadyEvent {

    @JsonProperty("type")
    OutboundLobbyEventType type();
}


