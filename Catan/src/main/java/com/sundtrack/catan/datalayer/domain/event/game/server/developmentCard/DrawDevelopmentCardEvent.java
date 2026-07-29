package com.sundtrack.catan.datalayer.domain.event.game.server.developmentCard;

import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.dto.snapshot.DevCardSnapshotDTO;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + DEVELOPMENT_CARD + SEPARATOR + "draw")
public record DrawDevelopmentCardEvent(
        DevCardSnapshotDTO card
) implements ServerEvent {
}
