package com.sundtrack.catan.datalayer.domain.game.trade;

import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

public class TradeOffer {

    private final UUID tradeOfferId;
    private final UUID tradeOwnerId;
    private final List<ResourceType> wantedResources;
    private final List<Resource> offeredResources;
    private final Map<UUID, TradeOfferResponseKind> playerResponses;

    public TradeOffer(
            UUID tradeOfferId,
            UUID tradeOwnerId,
            List<ResourceType> wantedResources,
            List<Resource> offeredResources,
            Map<UUID, TradeOfferResponseKind> playerResponses
    ) {
        this.tradeOfferId = tradeOfferId;
        this.tradeOwnerId = tradeOwnerId;
        this.wantedResources = List.copyOf(wantedResources != null ? wantedResources : List.of());
        this.offeredResources = List.copyOf(offeredResources != null ? offeredResources : List.of());
        this.playerResponses = new HashMap<>(
                playerResponses != null ? playerResponses : Map.of()
        );    }

    public TradeOffer(
            UUID tradeOwnerId,
            List<ResourceType> wantedResources,
            List<Resource> offeredResources,
            List<UUID> otherPlayerIds
    ) {
        this(
                UUID.randomUUID(),
                tradeOwnerId,
                wantedResources,
                offeredResources,
                otherPlayerIds.stream()
                        .collect(Collectors.toUnmodifiableMap(
                                Function.identity(),
                                id -> TradeOfferResponseKind.NO_ANSWER
                        ))
        );
    }

    public UUID getTradeOfferId() {
        return tradeOfferId;
    }

    public UUID getTradeOwnerId() {
        return tradeOwnerId;
    }

    public List<ResourceType> getWantedResources() {
        return wantedResources;
    }

    public List<Resource> getOfferedResources() {
        return offeredResources;
    }

    public Map<UUID, TradeOfferResponseKind> getPlayerResponses() {
        return playerResponses;
    }

    public void respond(UUID playerId, TradeOfferResponseKind response) {
        playerResponses.put(playerId, response);
    }
}
