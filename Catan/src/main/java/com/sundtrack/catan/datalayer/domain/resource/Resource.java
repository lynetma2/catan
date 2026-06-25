package com.sundtrack.catan.datalayer.domain.resource;

import java.util.UUID;

public record Resource(UUID uid, ResourceType resourceType) {
}