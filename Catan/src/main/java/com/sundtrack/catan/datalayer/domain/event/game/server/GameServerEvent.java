package com.sundtrack.catan.datalayer.domain.event.game.server;

import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

public sealed interface GameServerEvent extends ServerEvent permits BuildPlacedEvent, GameStateEvent {

    @Override
    default String domain() {
        return "server";
    }
}
