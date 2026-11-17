package com.sundtrack.catan.game.persistence.state;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public record GameStateDocument(
        int schemaVersion,
        UUID gameId,
        List<PlayerStateDocument> players,
        BoardStateDocument board,
        FlowStateDocument flow,
        List<TradeOfferStateDocument> tradeOffers,
        DicePairStateDocument dice,
        List<String> devDeck,
        Map<String, Integer> resourceBank,
        GameAwardsDocument awards
) {
    public static final int CURRENT_SCHEMA_VERSION = 1;
}