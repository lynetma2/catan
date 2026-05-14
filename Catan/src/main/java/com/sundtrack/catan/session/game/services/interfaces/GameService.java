package com.sundtrack.catan.session.game.services.interfaces;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.game.inbound.InboundGameEvent;
import com.sundtrack.catan.datalayer.domain.event.game.outbound.OutboundGameEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;

import java.security.Principal;
import java.util.Set;
import java.util.UUID;

public interface GameService {
    EventResult<OutboundGameEvent> handle(Principal principal, UUID gameId, InboundGameEvent event);
    void createGame(UUID id);
}
