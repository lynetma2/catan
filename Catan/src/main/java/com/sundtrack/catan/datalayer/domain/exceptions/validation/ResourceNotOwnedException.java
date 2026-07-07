package com.sundtrack.catan.datalayer.domain.exceptions.validation;

import java.util.UUID;

public class ResourceNotOwnedException extends GameRuleException {
    public ResourceNotOwnedException(UUID playerId, UUID resourceId) {
        super(
                ValidationErrorCode.RESOURCE_NOT_OWNED,
                "The resource with the id is not owned. playerId: " + playerId + " resourceId: " + resourceId
        );
    }
}
