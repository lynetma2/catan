package com.sundtrack.catan.game.domain.resource;

import java.util.UUID;

public record Resource(UUID uid, ResourceType resourceType) {
}