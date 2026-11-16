package com.sundtrack.catan.game.dto.trade;

import com.sundtrack.catan.game.domain.trade.TradeOffer;
import com.sundtrack.catan.game.domain.trade.TradePlayerResponse;
import com.sundtrack.catan.game.domain.resource.Resource;
import com.sundtrack.catan.game.domain.resource.ResourceType;

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
