package com.sundtrack.catan.datalayer.domain.event.game.action;

import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventType;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + "diceRoll")
public record RollDiceAction() implements ClientAction {
}
