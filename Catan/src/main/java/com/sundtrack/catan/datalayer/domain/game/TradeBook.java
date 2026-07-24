package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.exceptions.validation.*;
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOffer;
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOfferResponseKind;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class TradeBook {
    private final List<TradeOffer> activeOffers;

    public TradeBook(List<TradeOffer> activeOffers) {
        this.activeOffers = new ArrayList<>(activeOffers);
    }

    public List<TradeOffer> getActiveOffers() {
        return List.copyOf(activeOffers);
    }

    public TradeOffer start(UUID ownerId, List<Resource> offered, List<ResourceType> wanted, List<UUID> otherPlayerIds) {
        TradeOffer offer = new TradeOffer(ownerId, wanted, offered, otherPlayerIds);
        activeOffers.add(offer);
        return offer;
    }

    public void addAcceptResponse(UUID tradeId, UUID respondentId) {
        TradeOffer offer = getOrThrow(tradeId);
        requireNotOwner(offer, respondentId);
        requireInvited(offer, respondentId);
        offer.respond(respondentId, TradeOfferResponseKind.ACCEPT);
    }

    public void addDeclineResponse(UUID tradeId, UUID respondentId) {
        TradeOffer offer = getOrThrow(tradeId);
        requireNotOwner(offer, respondentId);
        requireInvited(offer, respondentId);
        offer.respond(respondentId, TradeOfferResponseKind.DECLINE);
    }

    public void confirm(UUID tradeId, UUID ownerId, UUID respondentId) {
        TradeOffer offer = getOrThrow(tradeId);
        requireOwner(offer, ownerId);
        if (!hasAccepted(offer, respondentId)) {
            throw new PlayerHasNotAcceptedTradeException(tradeId, respondentId);
        }
        activeOffers.remove(offer);
    }

    public record TradeTerms(List<Resource> offeredByInitiator, List<Resource> wantedFromRespondent) {}

    public void cancel(UUID tradeId, UUID ownerId) {
        TradeOffer offer = getOrThrow(tradeId);
        requireOwner(offer, ownerId);
        activeOffers.remove(offer);
    }

    public List<ResourceType> getWantedResourceTypes(UUID tradeOfferId) {
        return getOrThrow(tradeOfferId).getWantedResources();
    }

    public List<Resource> getOfferedResources(UUID tradeOfferId) {
        return getOrThrow(tradeOfferId).getOfferedResources();
    }

    private TradeOffer getOrThrow(UUID tradeId) {
        return activeOffers.stream()
                .filter(o -> o.getTradeOfferId().equals(tradeId))
                .findFirst()
                .orElseThrow(() -> new TradeOfferNotFoundException(tradeId));
    }

    private void requireOwner(TradeOffer offer, UUID playerId) {
        if (!offer.getTradeOwnerId().equals(playerId)) {
            throw new NotTradeOwnerException(offer.getTradeOfferId(), playerId);
        }
    }

    private void requireNotOwner(TradeOffer offer, UUID playerId) {
        if (offer.getTradeOwnerId().equals(playerId)) {
            throw new CannotRespondToOwnTradeException(offer.getTradeOfferId(), playerId);
        }
    }

    private void requireInvited(TradeOffer offer, UUID playerId) {
        if (!offer.getPlayerResponses().containsKey(playerId)) {
            throw new PlayerNotInvitedToTradeException(offer.getTradeOfferId(), playerId);
        }
    }

    private boolean hasAccepted(TradeOffer offer, UUID playerId) {
        return offer.getPlayerResponses().get(playerId) == TradeOfferResponseKind.ACCEPT;
    }
}