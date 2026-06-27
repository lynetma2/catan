package com.sundtrack.catan.datalayer.domain.event.game.action.robber;

import com.sundtrack.catan.datalayer.domain.board.Hex;
import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventType;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + ROBBER + SEPARATOR + "place")
public record PlaceRobberAction(
        Hex target
) implements ClientAction {
}
