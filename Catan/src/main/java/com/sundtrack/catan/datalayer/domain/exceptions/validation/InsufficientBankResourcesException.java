package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

public class InsufficientBankResourcesException extends GameRuleException {
    public InsufficientBankResourcesException(ResourceType type, Integer amount, Integer available) {
        super(
                ValidationErrorCode.INSUFFICIENT_BANK_RESOURCES,
                "Tried to draw amount: " + amount + " of type:" + type + " available:  " + available + " in bank"
        );
    }
}
