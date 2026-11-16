package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;
import static com.sundtrack.catan.shared.event.EventDomainConstants.SEPARATOR;

@EventType(ACTION + SEPARATOR + LOBBY + SEPARATOR + PLAYER + SEPARATOR + "ready")
public record PlayerReadyAction(
) implements ClientAction { }