package com.sundtrack.catan.session.game.datalayer.dto.snapshot;

import com.sundtrack.catan.session.game.datalayer.domain.GamePhase;
import com.sundtrack.catan.session.game.datalayer.domain.tradeOffer.TradeOffer;

import java.util.List;

/**
 * The master snapshot representing the total state of the game.
 */
public record GameSnapshotDTO(
        List<PlayerSnapshotDTO> players,
        List<TileSnapshotDTO> tiles,
        PlacementSnapshotDTO placements,
        GamePhase currentPhase,
        String currentPlayerId,
        int turnNumber,
        List<TradeOffer> activeTradeOffers
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