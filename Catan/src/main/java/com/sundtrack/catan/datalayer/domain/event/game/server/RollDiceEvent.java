package com.sundtrack.catan.datalayer.domain.event.game.server;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.datalayer.dto.snapshot.DiceRollDTO;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + "dice" + SEPARATOR + "roll")
public record RollDiceEvent(
        DiceRollDTO diceRoll
) implements ServerEvent {

}
