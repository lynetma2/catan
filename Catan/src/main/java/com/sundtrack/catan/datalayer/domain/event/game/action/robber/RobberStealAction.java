package com.sundtrack.catan.datalayer.domain.event.game.action.robber;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventType;

import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + ROBBER + SEPARATOR + "steal")
public record RobberStealAction(
        UUID targetPlayerId
) implements ClientAction {
}
