package com.sundtrack.catan.game.persistence.state;

import java.util.UUID;

public record ResourceStateDocument(
        UUID id,
        String type
) {}