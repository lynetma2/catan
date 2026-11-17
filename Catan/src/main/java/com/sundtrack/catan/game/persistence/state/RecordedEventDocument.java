package com.sundtrack.catan.game.persistence.state;

import java.time.Instant;
import java.util.UUID;

public record RecordedEventDocument(
        UUID playerId,
        Instant timestamp,
        EventEnvelopeDocument action,
        EventResultDocument resultingEvents
) {}
