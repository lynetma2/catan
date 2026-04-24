package com.sundtrack.catan.common.exceptions;

public class SnapshotNotFoundException extends RuntimeException {
    public SnapshotNotFoundException(String name) {
        super("Snapshot not found: " + name);
    }
}
