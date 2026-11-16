package com.sundtrack.catan.datalayer.domain.event.game.action;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + "state")
public record GameStateAction(UUID playerId) implements ClientAction {
}
