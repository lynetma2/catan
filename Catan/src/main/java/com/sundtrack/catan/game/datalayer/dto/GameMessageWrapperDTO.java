package com.sundtrack.catan.game.datalayer.dto;

public class GameMessageWrapperDTO<T> {
    private final GameMessageType type;
    private final T payload;

    public GameMessageWrapperDTO(GameMessageType type, T payload) {
        this.type = type;
        this.payload = payload;
    }

    public GameMessageType getType() { return type; }
    public T getPayload() { return payload; }
}
