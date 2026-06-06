package com.sundtrack.catan.datalayer.domain.event;

import com.fasterxml.jackson.databind.JsonNode;

public record EventEnvelope (
    String type,
    JsonNode payload
) {}
