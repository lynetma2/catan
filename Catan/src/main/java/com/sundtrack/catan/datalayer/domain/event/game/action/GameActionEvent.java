package com.sundtrack.catan.datalayer.domain.event.game.action;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;

public sealed interface GameActionEvent extends ClientAction permits GameStartAction, GameStateAction {

    @Override
    default String domain() {
        return "server";
    }
}
