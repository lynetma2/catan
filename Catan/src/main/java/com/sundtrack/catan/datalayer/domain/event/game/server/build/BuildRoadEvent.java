package com.sundtrack.catan.datalayer.domain.event.game.server.build;

import com.sundtrack.catan.datalayer.domain.board.Edge;
import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.event.EventType;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;

import java.util.UUID;

import static com.sundtrack.catan.datalayer.domain.event.EventDomainConstants.*;

@EventType(SERVER + SEPARATOR + GAME + SEPARATOR + BUILD + SEPARATOR + "road")
public record BuildRoadEvent(
        Edge edge,
        UUID playerId
) implements ServerEvent {
    public PieceType pieceType() {
        return PieceType.ROAD;
    }
}