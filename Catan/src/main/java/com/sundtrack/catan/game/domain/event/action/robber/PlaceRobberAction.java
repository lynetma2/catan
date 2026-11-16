package com.sundtrack.catan.game.domain.event.action.robber;

import com.sundtrack.catan.game.domain.board.Hex;
import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + ROBBER + SEPARATOR + "place")
public record PlaceRobberAction(
        Hex target
) implements ClientAction {
}
