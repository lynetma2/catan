package com.sundtrack.catan.session.game.services.interfaces;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.inbound.InboundGameEvent;

import java.util.UUID;

public interface GameService {
    EventResult handle(UUID gameId, InboundGameEvent event);
}
