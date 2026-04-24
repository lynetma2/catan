package com.sundtrack.catan.common.exceptions;

public class SnapshotAlreadyExistsException extends RuntimeException {
    public SnapshotAlreadyExistsException(String name) {
        super("Snapshot already exists: " + name);
    }
}
