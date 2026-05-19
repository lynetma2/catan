package com.sundtrack.catan.datalayer.domain.event.lobby.server;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.sundtrack.catan.datalayer.dto.snapshot.LobbySnapshotDTO;
import java.util.UUID;

@JsonTypeName("server.lobby.state")
public record LobbyStateEvent(
        UUID lobbyId,
        LobbySnapshotDTO snapshot,
        UUID localPlayerId
) implements LobbyServerEvent {}