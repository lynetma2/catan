package com.sundtrack.catan.game.domain.event.action;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + TURN + SEPARATOR + "end")
public record TurnEndAction(UUID playerId) implements ClientAction {
}
