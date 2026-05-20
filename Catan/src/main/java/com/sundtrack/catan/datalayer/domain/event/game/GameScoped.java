package com.sundtrack.catan.datalayer.domain.event.game;

public interface GameScoped {

    default String domain() {
        return "game";
    }
}