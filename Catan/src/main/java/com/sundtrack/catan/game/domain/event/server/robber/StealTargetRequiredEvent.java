package com.sundtrack.catan.game.domain.event.server.robber;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.util.List;
import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + ROBBER + SEPARATOR + "stealTargetRequired")
public record StealTargetRequiredEvent(
        UUID retrievingPlayerId,
        List<UUID> candidates
) implements ServerEvent {
}
