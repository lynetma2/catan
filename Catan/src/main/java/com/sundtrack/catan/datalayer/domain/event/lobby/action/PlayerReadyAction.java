package com.sundtrack.catan.datalayer.domain.event.lobby.action;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventType;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;
import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.SEPARATOR;

@EventType(ACTION + SEPARATOR + LOBBY + SEPARATOR + PLAYER + SEPARATOR + "ready")
public record PlayerReadyAction(
) implements ClientAction { }