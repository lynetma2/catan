package com.sundtrack.catan.datalayer.domain.event.game.action;

import java.util.UUID;

public record GameStartAction(UUID playerId) implements GameActionEvent {

    @Override
    public UUID playerId() {
        return playerId;
    }

    @Override
    public String action() {
        return "start";
    }
}
