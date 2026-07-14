package com.sundtrack.catan.datalayer.dto.mapper;

import com.sundtrack.catan.datalayer.domain.board.Edge;
import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.board.tile.Tile;
import com.sundtrack.catan.datalayer.domain.building.Building;
import com.sundtrack.catan.datalayer.domain.developmentCard.DevelopmentCard;
import com.sundtrack.catan.datalayer.domain.game.DiscardSession;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.domain.game.GamePlayer;
import com.sundtrack.catan.datalayer.domain.game.StealSession;
import com.sundtrack.catan.datalayer.dto.placement.CityPlacementDTO;
import com.sundtrack.catan.datalayer.dto.placement.RoadPlacementDTO;
import com.sundtrack.catan.datalayer.dto.placement.SettlementPlacementDTO;
import com.sundtrack.catan.datalayer.dto.snapshot.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class GameMapper {

    public GameSnapshotDTO toSnapshotDTO(Game game, UUID playerId) {
        return new GameSnapshotDTO(
                game.getId().toString(),
                mapPlayers(game.getPlayers()),
                mapTiles(game.getTiles()),
                mapPlacements(game.getBuildings()),
                game.getCurrentPhase(),
                game.getCurrentPlayerId().toString(),
                game.getTurnNumber(),
                game.getActiveTradeOffers(),
                mapDiscardSession(game.getDiscardSession(), playerId),
                game.getDiceRoll(),
                mapStealSession(game.getStealSession())
        );
    }

    private List<PlayerSnapshotDTO> mapPlayers(List<GamePlayer> players) {
        // Map GamePlayer domain to PlayerSnapshotDTO
        return players
                .stream()
                .map(p ->
                        new PlayerSnapshotDTO(p.getId().toString(), p.getUsername(),
                                p.getColor(), p.getResources(), mapDevCards(p.getDevelopmentCards()),
                                p.getVictoryPoints(), p.getCardCount(), p.getDevelopmentCardCount(),
                                p.getHasLongestRoad(), p.getHasLargestArmy(), p.getKnightsUsed()))
                .toList();
    }

    private List<TileSnapshotDTO> mapTiles(List<Tile> tiles) {
        return tiles
                .stream()
                .map(tile ->
                        new TileSnapshotDTO(
                                tile.getHex(), tile.getKind(), tile.getType(),
                                tile.getNumber(), tile.hasRobber(), tile.isPort(),
                                tile.getPortType(), tile.getPortFacing()
                        ))
                .toList();
    }

    private PlacementSnapshotDTO mapPlacements(List<Building<?>> buildings) {
        List<RoadPlacementDTO> roads = new ArrayList<>();
        List<SettlementPlacementDTO> settlements = new ArrayList<>();
        List<CityPlacementDTO> cityPlacements = new ArrayList<>();

        buildings.forEach(building -> {
            switch (building.getKind()) {
                case ROAD:
                    RoadPlacementDTO road = new RoadPlacementDTO((Edge) building.getLocation(), building.getOwnerId().toString());
                    roads.add(road);
                    break;
                case SETTLEMENT:
                    SettlementPlacementDTO settlement = new SettlementPlacementDTO((Vertex) building.getLocation(), building.getOwnerId().toString());
                    settlements.add(settlement);
                    break;
                case CITY:
                    CityPlacementDTO city = new CityPlacementDTO((Vertex) building.getLocation(), building.getOwnerId().toString());
                    cityPlacements.add(city);
                    break;
            }
        });

        return new PlacementSnapshotDTO(roads, settlements, cityPlacements);
    }

    private DiscardSessionDTO mapDiscardSession(DiscardSession discardSession, UUID playerId) {
        boolean mustDiscard = discardSession.isPending(playerId);
        int discardAmount = discardSession.getRequiredCount(playerId);
        return new DiscardSessionDTO(mustDiscard, discardAmount);
    }

    private StealSessionDTO mapStealSession(StealSession stealSession) {
        return new StealSessionDTO(stealSession.isActive(), stealSession.getRetrievingPlayerId(), stealSession.getCandidates());
    }

    private List<DevCardSnapshotDTO> mapDevCards(List<DevelopmentCard> cards) {
        return cards
                .stream()
                .map(card ->
                        new DevCardSnapshotDTO(card.getId().toString(),
                                card.getType(),
                                card.isBoughtThisTurn()))
                .toList();
    }
}
