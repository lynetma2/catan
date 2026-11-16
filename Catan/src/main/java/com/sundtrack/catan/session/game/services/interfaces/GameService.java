package com.sundtrack.catan.session.game.services.interfaces;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.security.Principal;
import java.util.UUID;

public interface GameService {
    EventResult<ServerEvent> handle(Principal principal, UUID gameId, ClientAction event);

    void createGame(UUID id);
}
