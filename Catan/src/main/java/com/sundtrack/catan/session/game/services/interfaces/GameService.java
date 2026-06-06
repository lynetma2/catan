package com.sundtrack.catan.session.game.services.interfaces;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

import java.security.Principal;
import java.util.UUID;

public interface GameService {
    EventResult<ServerEvent> handle(Principal principal, UUID gameId, ClientAction event);

    void createGame(UUID id);
}
