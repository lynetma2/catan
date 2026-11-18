package com.sundtrack.catan.game.persistence.state;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public record TradeOfferStateDocument(
        UUID offerId,
        UUID initiatorId,
        List<ResourceStateDocument> offeredResources,
        List<String> wantedResources,
        Map<UUID, String> responses
) {}