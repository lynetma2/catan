package com.sundtrack.catan.session.lobby.eventHandlers;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;

public interface LobbyActionHandler<T extends ClientAction> {

    EventResult<ServerEvent> handle(
            LobbyContext context,
            T action);
}
