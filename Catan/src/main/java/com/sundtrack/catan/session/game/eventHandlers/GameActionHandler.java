package com.sundtrack.catan.session.game.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;

public interface GameActionHandler<T extends ClientAction> {

    EventResult<ServerEvent> handle(
            GameContext context,
            Game game,
            T action);
}
