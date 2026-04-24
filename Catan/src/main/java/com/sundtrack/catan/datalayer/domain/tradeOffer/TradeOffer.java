package com.sundtrack.catan.datalayer.domain.tradeOffer;

import com.sundtrack.catan.datalayer.domain.Resource;

import java.util.List;

public record TradeOffer(
        TradeOfferKind kind,
        String tradeOfferId,
        String tradeOwnerId,
        List<Resource> wantedResources,
        List<Resource> offeredResources,
        List<TradePlayerResponse> playerResponses
) {
    public TradeOffer {
        wantedResources = List.copyOf(wantedResources != null ? wantedResources : List.of());
        offeredResources = List.copyOf(offeredResources != null ? offeredResources : List.of());
        playerResponses = List.copyOf(playerResponses != null ? playerResponses : List.of());
    }
}
