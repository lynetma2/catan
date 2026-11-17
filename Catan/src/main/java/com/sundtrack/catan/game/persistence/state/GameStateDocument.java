package com.sundtrack.catan.game.persistence.state;

import java.util.List;
import java.util.UUID;

public record GameStateDocument(
        int schemaVersion,
        UUID gameId,
        List<PlayerStateDocument> players,
        BoardStateDocument board,
        FlowStateDocument flow,
        List<TradeOfferStateDocument> tradeOffers,
        int[] lastDiceRoll,
        List<String> devDeck,             // remaining dev-card deck, order matters
        java.util.Map<String, Integer> resourceBank,  // ResourceType name -> count
        int turnNumber
) {
    public static final int CURRENT_SCHEMA_VERSION = 1;
}