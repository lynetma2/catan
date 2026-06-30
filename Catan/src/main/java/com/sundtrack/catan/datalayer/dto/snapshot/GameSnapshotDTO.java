package com.sundtrack.catan.datalayer.dto.snapshot;

import com.sundtrack.catan.datalayer.domain.game.GamePhase;
import com.sundtrack.catan.datalayer.domain.trade.TradeOffer;

import java.util.List;

/**
 * The master snapshot representing the total state of the game.
 */
public record GameSnapshotDTO(
        String id,
        List<PlayerSnapshotDTO> players,
        List<TileSnapshotDTO> tiles,
        PlacementSnapshotDTO placements,
        GamePhase currentPhase,
        String currentPlayerId,
        int turnNumber,
        List<TradeOffer> activeTradeOffers,
        DiscardSessionDTO discardSession,
        List<Integer> diceRoll,
        StealSessionDTO stealSession
) {
    public GameSnapshotDTO {
        // Ensure all lists are immutable and null-safe
        players = List.copyOf(players != null ? players : List.of());
        tiles = List.copyOf(tiles != null ? tiles : List.of());
        activeTradeOffers = List.copyOf(activeTradeOffers != null ? activeTradeOffers : List.of());

        if (currentPlayerId == null) {
            throw new IllegalArgumentException("currentPlayerId cannot be null");
        }
    }
}