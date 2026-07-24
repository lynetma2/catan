package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import java.util.UUID;

public class PlayerNotInvitedToTradeException extends GameRuleException {
    public PlayerNotInvitedToTradeException(UUID tradeOfferId, UUID playerId) {
        super(
                ValidationErrorCode.PLAYER_NOT_INVITED_TO_TRADE,
                "The player cannot respond to trade it is not invited to. tradeOfferId: " + tradeOfferId + ", playerId: " + playerId
        );
    }
}
