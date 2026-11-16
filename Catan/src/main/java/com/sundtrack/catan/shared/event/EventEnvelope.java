package com.sundtrack.catan.shared.event;

import com.fasterxml.jackson.databind.JsonNode;

public record EventEnvelope (
    String type,
    JsonNode payload
) {}
