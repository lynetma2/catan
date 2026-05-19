package com.sundtrack.catan.session.game.services.interfaces;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.game.inbound.InboundGameEvent;
import com.sundtrack.catan.datalayer.domain.event.game.outbound.ServerGameEvent;

import java.security.Principal;
import java.util.UUID;

public interface GameService {
    EventResult<ServerGameEvent> handle(Principal principal, UUID gameId, InboundGameEvent event);
    void createGame(UUID id);
}
