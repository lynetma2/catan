package com.sundtrack.catan.datalayer.domain.event.game.action;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventType;

import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + TURN + SEPARATOR + "end")
public record TurnEndAction(UUID playerId) implements ClientAction {
}
