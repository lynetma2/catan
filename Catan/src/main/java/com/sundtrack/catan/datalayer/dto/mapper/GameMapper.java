package com.sundtrack.catan.datalayer.dto.mapper;

import com.sundtrack.catan.datalayer.domain.board.Edge;
import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.board.tile.Tile;
import com.sundtrack.catan.datalayer.domain.building.Building;
import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePlayer;
import com.sundtrack.catan.datalayer.domain.game.trade.TradeOffer;
import com.sundtrack.catan.datalayer.domain.resource.Resource;
import com.sundtrack.catan.datalayer.dto.placement.CityPlacementDTO;
import com.sundtrack.catan.datalayer.dto.placement.RoadPlacementDTO;
import com.sundtrack.catan.datalayer.dto.placement.SettlementPlacementDTO;
import com.sundtrack.catan.datalayer.dto.snapshot.*;
import com.sundtrack.catan.datalayer.dto.trade.TradeOfferDTO;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class GameMapper {

    public GameSnapshotDTO toSnapshotDTO(Game game, UUID viewingPlayerId) {
        return new GameSnapshotDTO(
                game.getId().toString(),
                mapPlayers(game, viewingPlayerId),
                mapTiles(game.getTiles()),
                mapPlacements(game.getBuildings()),
                game.getCurrentPhase(),
                game.getCurrentPlayerId().toString(),
                game.getTurnNumber(),
                mapTradeOffers(game.getActiveTradeOffers()),
                game.getDiceRoll(),
                FlowStateMapper.toDTO(game)
        );
    }

    private List<PlayerSnapshotDTO> mapPlayers(Game game, UUID viewingPlayerId) {
        Map<UUID, Integer> longestRoads = game.getLongestRoadLengths();
        return game.getPlayers().stream()
                .map(p -> {
                    int longestRoadLength = longestRoads.getOrDefault(p.getId(), 0);
                    return mapPlayer(game, p, p.getId().equals(viewingPlayerId), longestRoadLength);
                })
                .toList();
    }

    private List<TileSnapshotDTO> mapTiles(List<Tile> tiles) {
        return tiles.stream()
                .map(tile -> new TileSnapshotDTO(
                        tile.getHex(), tile.getKind(), tile.getType(),
                        tile.getNumber(), tile.hasRobber(), tile.isPort(),
                        tile.getPortType(), tile.getPortFacing()))
                .toList();
    }

    private PlacementSnapshotDTO mapPlacements(List<Building<?>> buildings) {
        List<RoadPlacementDTO> roads = new ArrayList<>();
        List<SettlementPlacementDTO> settlements = new ArrayList<>();
        List<CityPlacementDTO> cities = new ArrayList<>();

        buildings.forEach(building -> {
            switch (building.getKind()) {
                case ROAD ->
                        roads.add(new RoadPlacementDTO((Edge) building.getLocation(), building.getOwnerId().toString()));
                case SETTLEMENT ->
                        settlements.add(new SettlementPlacementDTO((Vertex) building.getLocation(), building.getOwnerId().toString()));
                case CITY ->
                        cities.add(new CityPlacementDTO((Vertex) building.getLocation(), building.getOwnerId().toString()));
            }
        });

        return new PlacementSnapshotDTO(roads, settlements, cities);
    }

    private List<TradeOfferDTO> mapTradeOffers(List<TradeOffer> offers) {
        return offers.stream()
                .map(TradeOfferDTO::new)
                .toList();
    }

    private PlayerSnapshotDTO mapPlayer(Game game, GamePlayer p, boolean isViewer, int longestRoad) {
        List<Resource> visibleResources = isViewer ? p.getResources() : List.of();
        List<DevCardSnapshotDTO> visibleDevCards = isViewer ? mapDevCards(p.getDevelopmentCards()) : List.of();
        long visibleVictoryPoints = isViewer ? game.computeTotalVictoryPoints(p.getId()) : game.computePublicVictoryPoints(p.getId());

        return new PlayerSnapshotDTO(
                p.getId().toString(),
                p.getUsername(),
                p.getColor(),
                visibleResources,
                visibleDevCards,
                visibleVictoryPoints,
                p.getResourceCardCount(),
                p.getDevelopmentCardCount(),
                game.hasLongestRoad(p.getId()),
                game.hasLargestArmy(p.getId()),
                longestRoad,
                p.getKnightsUsed()
        );
    }

    private List<DevCardSnapshotDTO> mapDevCards(List<DevelopmentCard> cards) {
        return cards.stream()
                .map(DevCardSnapshotDTO::new)
                .toList();
    }

    public GameSnapshotDTO toFullSnapshotDTO(Game game) {
        return new GameSnapshotDTO(
                game.getId().toString(),
                mapAllPlayersFully(game), // Use the new method below
                mapTiles(game.getTiles()),
                mapPlacements(game.getBuildings()),
                game.getCurrentPhase(),
                game.getCurrentPlayerId().toString(),
                game.getTurnNumber(),
                mapTradeOffers(game.getActiveTradeOffers()),
                game.getDiceRoll(),
                FlowStateMapper.toDTO(game)
        );
    }

    private List<PlayerSnapshotDTO> mapAllPlayersFully(Game game) {
        Map<UUID, Integer> longestRoads = game.getLongestRoadLengths();
        return game.getPlayers().stream()
                .map(p -> {
                    int longestRoadLength = longestRoads.getOrDefault(p.getId(), 0);
                    // Force isViewer = true to expose ALL resources and dev cards for persistence
                    return mapPlayer(game, p, true, longestRoadLength);
                })
                .toList();
    }

    public EndSummaryDTO toEndSummaryDTO(Game game) {
        List<GamePlayer> players = game.getPlayers();

        GamePlayer winner = players.stream()
                .max(Comparator
                        .comparingLong((GamePlayer p) -> game.computeTotalVictoryPoints(p.getId()))
                        .thenComparingInt(GamePlayer::getResourceCardCount)
                        .thenComparingInt(GamePlayer::getDevelopmentCardCount))
                .orElseThrow(() -> new IllegalStateException("Cannot determine winner for a game with no players"));

        List<EndPlayerSummaryDTO> playerSummaries = players.stream()
                .map(p -> toEndPlayerSummaryDTO(game, p))
                .toList();

        return new EndSummaryDTO(
                winner.getId().toString(),
                playerSummaries
        );
    }

    private EndPlayerSummaryDTO toEndPlayerSummaryDTO(Game game, GamePlayer p) {
        return new EndPlayerSummaryDTO(
                p.getId().toString(),
                p.getUsername(),
                p.getColor(),
                (int) game.computeTotalVictoryPoints(p.getId()),
                game.hasLongestRoad(p.getId()),
                game.hasLargestArmy(p.getId())
        );
    }
}