package com.sundtrack.catan.game.domain.event.server.build;

import com.sundtrack.catan.game.domain.board.Vertex;
import com.sundtrack.catan.game.domain.building.PieceType;
import com.sundtrack.catan.shared.event.EventType;
import com.sundtrack.catan.shared.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.shared.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + BUILD + SEPARATOR + "settlement")
public record BuildSettlementEvent(
        Vertex vertex,
        UUID playerId
) implements ServerEvent {
    public PieceType pieceType() {
        return PieceType.SETTLEMENT;
    }
}