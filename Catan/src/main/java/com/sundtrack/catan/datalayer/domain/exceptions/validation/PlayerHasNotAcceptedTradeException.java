package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.building.Building;

import java.util.UUID;

public class PlayerHasNotAcceptedTradeException extends GameRuleException {
    public PlayerHasNotAcceptedTradeException(UUID tradeId, UUID respondentId) {
        super(
                ValidationErrorCode.RESPONDER_HAS_NOT_ACCEPTED_TRADE,
                "TradeOffer id: " + tradeId + " has not been accepted by respondent with id : " + respondentId
        );
    }
}
