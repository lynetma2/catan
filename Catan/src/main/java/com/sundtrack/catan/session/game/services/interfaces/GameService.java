package com.sundtrack.catan.session.game.services.interfaces;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.game.inbound.InboundGameEvent;
import com.sundtrack.catan.datalayer.domain.event.game.outbound.OutboundGameEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;

import java.util.Set;
import java.util.UUID;

public interface GameService {
    EventResult<OutboundGameEvent> handle(UUID gameId, InboundGameEvent event);
    Game createGame(UUID id, Set<UUID> playerIds);
}
