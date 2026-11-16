package com.sundtrack.catan.lobby.application.handler;

import com.sundtrack.catan.lobby.application.LobbyContext;
import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;

public interface LobbyActionHandler<T extends ClientAction> {

    EventResult<ServerEvent> handle(
            LobbyContext context,
            T action);
}
