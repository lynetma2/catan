package com.sundtrack.catan.session.game.services.interfaces;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.game.action.GameActionEvent;
import com.sundtrack.catan.datalayer.domain.event.game.server.GameServerEvent;

import java.security.Principal;
import java.util.UUID;

public interface GameService {
    EventResult<GameServerEvent> handle(Principal principal, UUID gameId, GameActionEvent event);
    void createGame(UUID id);
}
