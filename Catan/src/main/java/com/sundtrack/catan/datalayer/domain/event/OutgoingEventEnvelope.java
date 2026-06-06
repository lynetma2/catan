package com.sundtrack.catan.datalayer.domain.event;

public record OutgoingEventEnvelope(
        String type,
        Object payload
) {
}
