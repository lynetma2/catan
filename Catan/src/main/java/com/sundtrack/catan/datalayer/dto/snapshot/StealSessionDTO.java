package com.sundtrack.catan.datalayer.dto.snapshot;

import java.util.List;
import java.util.UUID;

public record StealSessionDTO(boolean isActive, UUID retrievingPlayerId, List<UUID> candidates) {
}
