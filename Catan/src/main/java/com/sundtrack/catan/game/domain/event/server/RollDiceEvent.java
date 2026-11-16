package com.sundtrack.catan.game.domain.event.server;

import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.dto.snapshot.DiceRollDTO;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + "dice" + SEPARATOR + "roll")
public record RollDiceEvent(
        DiceRollDTO diceRoll
) implements ServerEvent {

}
