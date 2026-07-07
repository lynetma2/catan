package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import java.util.UUID;

public class PlayerNotPendingDiscardException extends GameRuleException {
    public PlayerNotPendingDiscardException(UUID playerId) {
        super(
                ValidationErrorCode.PLAYER_NOT_PENDING_DISCARD,
                "Player is not pending discard. playerId: " + playerId
        );
    }
}
