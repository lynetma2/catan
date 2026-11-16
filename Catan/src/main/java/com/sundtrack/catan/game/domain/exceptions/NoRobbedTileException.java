package com.sundtrack.catan.game.domain.exceptions;

public class NoRobbedTileException extends RuntimeException {
    public NoRobbedTileException(String message) {
        super(message);
    }
}
