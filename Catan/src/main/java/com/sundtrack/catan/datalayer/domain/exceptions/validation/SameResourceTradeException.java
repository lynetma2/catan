package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

public class SameResourceTradeException extends GameRuleException {
    public SameResourceTradeException(ResourceType resourceType) {
        super(
                ValidationErrorCode.SAME_RESOURCE_TRADE,
                "The given resourceType and the wanted resourceType is the same, resourceType: " + resourceType
        );
    }
}
