package com.sundtrack.catan.game.application.handler;

import com.sundtrack.catan.game.application.GameContext;
import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.Game;

public interface GameActionHandler<T extends ClientAction> {

    EventResult<ServerEvent> handle(
            GameContext context,
            Game game,
            T action);
}
