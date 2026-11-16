package com.sundtrack.catan.session;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventResult;

import java.security.Principal;
import java.util.UUID;

public interface ActionHandler<T extends ClientAction> {

    EventResult<?> handle(
            Principal principal,
            UUID contextId,
            T action
    );
}
