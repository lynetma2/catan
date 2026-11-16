package com.sundtrack.catan.game.domain.event.action.build;

import com.sundtrack.catan.game.domain.board.Vertex;
import com.sundtrack.catan.game.domain.building.PieceType;
import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.shared.event.EventType;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(ACTION + SEPARATOR + GAME + SEPARATOR + "build" + SEPARATOR + "settlement")
public record PlaceSettlementAction(
        Vertex target
) implements ClientAction {
    public PieceType pieceType() {
        return PieceType.SETTLEMENT;
    }
}
