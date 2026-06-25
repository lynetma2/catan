package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.game.GamePhase;

public class IllegalGamePhaseException extends GameRuleException {
    public IllegalGamePhaseException(GamePhase gamePhase) {
        super(
                ValidationErrorCode.ILLEGAL_ACTION_IN_GAME_PHASE,
                "Illegal action in current GamePhase: " + gamePhase.toString() + " Allowed actions: " + gamePhase.getAllowedActions().toString()
        );
    }
}
