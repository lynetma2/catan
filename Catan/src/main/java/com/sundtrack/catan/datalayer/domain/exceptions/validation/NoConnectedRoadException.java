package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.board.Edge;
import com.sundtrack.catan.datalayer.domain.board.Vertex;

import java.util.UUID;

public class NoConnectedRoadException extends GameRuleException {
    public NoConnectedRoadException(Vertex vertex, UUID playerId) {
        super(
                ValidationErrorCode.NO_CONNECTED_ROAD_VIOLATED,
                "Vertex " + vertex + " is not connected to a road of player " + playerId
        );
    }

    public NoConnectedRoadException(Edge edge, UUID playerId) {
        super(
                ValidationErrorCode.NO_CONNECTED_ROAD_VIOLATED,
                "Edge " + edge + " is not connected to player " + playerId + "'s network"
        );
    }
}
