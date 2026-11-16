package com.sundtrack.catan.shared.event;

public record OutgoingEventEnvelope(
        String type,
        Object payload
) {
}
