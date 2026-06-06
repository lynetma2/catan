package com.sundtrack.catan.session;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;

import java.security.Principal;
import java.util.UUID;

public interface ActionHandler<T extends ClientAction> {

    EventResult<?> handle(
            Principal principal,
            UUID contextId,
            T action
    );
}
