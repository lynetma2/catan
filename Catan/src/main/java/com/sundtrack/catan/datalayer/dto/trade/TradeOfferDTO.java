package com.sundtrack.catan.datalayer.dto.trade;

import com.sundtrack.catan.datalayer.domain.game.trade.TradeOffer;
import com.sundtrack.catan.datalayer.domain.game.trade.TradePlayerResponse;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

import java.util.List;
import java.util.UUID;

public record TradeOfferDTO(
        UUID tradeOfferId,
        UUID tradeOwnerId,
        List<ResourceType> wantedResources,
        List<Resource> offeredResources,
        List<TradePlayerResponse> playerResponses
) {
    public TradeOfferDTO(TradeOffer tradeOffer) {
        this(
                tradeOffer.getTradeOfferId(),
                tradeOffer.getTradeOwnerId(),
                tradeOffer.getWantedResources(),
                tradeOffer.getOfferedResources(),
                tradeOffer.getPlayerResponses().entrySet().stream()
                        .map(entry -> new TradePlayerResponse(
                                entry.getKey(),
                                entry.getValue()
                        ))
                        .toList()
        );
    }

    public TradeOfferDTO {
        wantedResources = List.copyOf(wantedResources != null ? wantedResources : List.of());
        offeredResources = List.copyOf(offeredResources != null ? offeredResources : List.of());
        playerResponses = List.copyOf(playerResponses != null ? playerResponses : List.of());
    }
}
