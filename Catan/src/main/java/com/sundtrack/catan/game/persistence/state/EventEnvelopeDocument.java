package com.sundtrack.catan.game.persistence.state;

import com.fasterxml.jackson.databind.JsonNode;

public record EventEnvelopeDocument(String type, JsonNode payload) {

}

