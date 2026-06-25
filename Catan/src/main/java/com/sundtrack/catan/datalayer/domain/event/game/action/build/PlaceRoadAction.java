package com.sundtrack.catan.datalayer.domain.event.game.action.build;

import com.sundtrack.catan.datalayer.domain.board.Edge;
import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventType;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + "build" + SEPARATOR + "road")
public record PlaceRoadAction(
        Edge target
) implements ClientAction {
    public PieceType pieceType() {
        return PieceType.ROAD;
    }
}
