package com.sundtrack.catan.datalayer.domain.event.game.action.build;

import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventType;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + "build" + SEPARATOR + "settlement")
public record PlaceSettlementAction(
        Vertex target
) implements ClientAction {
    public PieceType pieceType() {
        return PieceType.SETTLEMENT;
    }
}
