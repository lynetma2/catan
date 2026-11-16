package com.sundtrack.catan.game.domain.event.action;

import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + "dice" + SEPARATOR + "roll")
public record RollDiceAction() implements ClientAction {
}
