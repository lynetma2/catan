package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

public class GivenResourcesWrongTradeException extends GameRuleException {
    public GivenResourcesWrongTradeException() {
        super(
                ValidationErrorCode.GIVEN_RESOURCES_WRONG_IN_TRADE,
                "The given resources in the trade are wrong."
        );
    }
}
