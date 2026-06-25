package com.sundtrack.catan.datalayer.domain.exceptions.validation;

public abstract class GameRuleException extends RuntimeException {

    private final ValidationErrorCode code;

    protected GameRuleException(
            ValidationErrorCode code,
            String message) {

        super(message);
        this.code = code;
    }

    public ValidationErrorCode code() {
        return code;
    }
}
