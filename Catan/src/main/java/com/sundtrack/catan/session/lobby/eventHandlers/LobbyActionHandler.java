package com.sundtrack.catan.session.lobby.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

public interface LobbyActionHandler<T extends ClientAction> {

    EventResult<ServerEvent> handle(
            LobbyContext context,
            T action);
}
