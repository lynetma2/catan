package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import java.util.HashMap;
import java.util.Map;

public abstract class GameRuleException extends RuntimeException {

    private final ValidationErrorCode code;
    private final Map<String, Object> details;

    protected GameRuleException(
            ValidationErrorCode code,
            String message) {
        super(message);
        this.code = code;
        this.details = Map.of();
    }

    protected GameRuleException(ValidationErrorCode code, String message, Map<String, Object> details) {
        super(message);
        this.code = code;
        this.details = details;
    }

    public ValidationErrorCode code() {
        return code;
    }

    public Map<String, Object> details() {
        return details;
    }
}
