package com.sundtrack.catan.datalayer.domain.exceptions;

public class NoRobbedTileException extends RuntimeException {
    public NoRobbedTileException(String message) {
        super(message);
    }
}
