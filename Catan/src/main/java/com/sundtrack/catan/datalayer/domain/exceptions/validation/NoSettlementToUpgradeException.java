package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.board.Vertex;

public class NoSettlementToUpgradeException extends GameRuleException {
    public NoSettlementToUpgradeException(Vertex vertex) {
        super(
                ValidationErrorCode.NO_SETTLEMENT_TO_UPGRADE,
                "No settlement to upgrade, vertex: " + vertex
        );
    }
}
