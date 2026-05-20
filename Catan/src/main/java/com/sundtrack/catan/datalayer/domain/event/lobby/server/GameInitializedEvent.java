package com.sundtrack.catan.datalayer.domain.event.lobby.server;

public record GameInitializedEvent(
) implements LobbyServerEvent {
    @Override
    public String event() {
        return "initialized";
    }
}
