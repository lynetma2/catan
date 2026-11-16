package com.sundtrack.catan.lobby.domain.event.action;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + LOBBY + SEPARATOR + PLAYER + SEPARATOR + "unready")
public record PlayerUnreadyAction(
) implements ClientAction { }
