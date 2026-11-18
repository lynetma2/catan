package com.sundtrack.catan.game.persistence.state;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public record EventResultDocument(
        List<EventEnvelopeDocument> broadcast,
        Map<UUID, List<EventEnvelopeDocument>> directed
) {}
