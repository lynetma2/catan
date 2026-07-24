package com.sundtrack.catan.datalayer.domain.board;

import com.sundtrack.catan.datalayer.domain.board.tile.PortType;
import com.sundtrack.catan.datalayer.domain.board.tile.Tile;
import com.sundtrack.catan.datalayer.domain.board.tile.TileKind;
import com.sundtrack.catan.datalayer.domain.building.Building;
import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.exceptions.NoRobbedTileException;
import com.sundtrack.catan.datalayer.domain.exceptions.validation.*;
import com.sundtrack.catan.datalayer.domain.game.LongestRoadCalculator;
import com.sundtrack.catan.datalayer.domain.resource.ResourceType;

import java.util.*;
import java.util.stream.Collectors;

public class Board {

    private final List<Tile> tiles;
    private final List<Building<?>> buildings;

    public Board(List<Tile> tiles, List<Building<?>> buildings) {
        this.tiles = tiles;
        this.buildings = buildings;
    }

    public List<Tile> getTiles() {
        return tiles;
    }

    public List<Building<?>> getBuildings() {
        return buildings;
    }

    public Set<UUID> getAdjacentPlayerIds(Hex target) {
        Set<UUID> adjacentPlayerIds = new HashSet<>();
        Tile tile = getTileAt(target);
        List<Vertex> adjacentVertices = tile.getAdjacentVertices();
        for (Vertex vertex : adjacentVertices) {
            Optional<Building<?>> building = getBuildingAt(vertex);
            building.ifPresent(vertexBuilding -> adjacentPlayerIds.add(vertexBuilding.getOwnerId()));
        }
        return adjacentPlayerIds;
    }

    public Tile getTileAt(Hex hex) {
        return tiles
                .stream()
                .filter(tile -> tile.getHex().equals(hex))
                .findFirst()
                .orElseThrow(() -> new NoTileOnHexException(hex));
    }

    public Optional<Building<?>> getBuildingAt(Vertex vertex) {
        return buildings.stream()
                .filter(b -> b.getLocation() instanceof Vertex)
                .filter(b -> b.getLocation().equals(vertex))
                .findFirst();
    }

    public Building<Vertex> placeSettlement(Vertex vertex, UUID playerId, boolean skipRoadConnectionRule) {
        validateSettlementPlacement(vertex, playerId, skipRoadConnectionRule); // now private
        Building<Vertex> settlement = Building.settlement(playerId, vertex);
        buildings.add(settlement);
        return settlement;
    }

    private void validateSettlementPlacement(Vertex vertex, UUID playerId, boolean skipRoadConnectionRule) {
        if (isVertexOccupied(vertex)) throw new VertexOccupiedException(vertex);
        if (isAnyAdjacentVertexOccupied(vertex)) throw new DistanceRuleException(vertex);
        if (!skipRoadConnectionRule && !isVertexConnectedToPlayerRoad(vertex, playerId)) {
            throw new NoConnectedRoadException(vertex, playerId);
        }
    }

    public boolean isVertexOccupied(Vertex vertex) {
        return getBuildingAt(vertex).isPresent();
    }

    public boolean isAnyAdjacentVertexOccupied(Vertex vertex) {
        return buildings.stream()
                .filter(b -> b.getLocation() instanceof Vertex)
                .map(b -> (Vertex) b.getLocation())
                .anyMatch(vertex::isAdjacentTo);
    }

    public boolean isVertexConnectedToPlayerRoad(Vertex vertex, UUID playerId) {
        // A road (edge) is adjacent to a vertex if the vertex's hexes include the edge's two hexes
        return buildings.stream()
                .filter(b -> b.getOwnerId().equals(playerId))
                .filter(b -> b.getLocation() instanceof Edge)
                .map(b -> (Edge) b.getLocation())
                .anyMatch(edge -> edge.isAdjacentTo(vertex));
    }

    public Building<Edge> placeRoad(Edge edge, UUID playerId, boolean skipNetworkRule) {
        validateRoadPlacement(edge, playerId, skipNetworkRule); // now private
        Building<Edge> road = Building.road(playerId, edge);
        buildings.add(road);
        return road;
    }

    private void validateRoadPlacement(Edge edge, UUID playerId, boolean skipNetworkRule) {
        if (isEdgeOccupied(edge)) throw new EdgeOccupiedException(edge);
        if (!isEdgeBuildable(edge)) throw new InvalidEdgeException(edge);
        if (!skipNetworkRule && !isEdgeConnectedToPlayerNetwork(edge, playerId)) {
            throw new NoConnectedRoadException(edge, playerId);
        }
    }

    public boolean isEdgeOccupied(Edge edge) {
        return buildings.stream()
                .filter(b -> b.getLocation() instanceof Edge)
                .anyMatch(b -> b.getLocation().equals(edge));
    }

    public boolean isEdgeConnectedToPlayerNetwork(Edge edge, UUID playerId) {
        List<Vertex> endpoints = edge.getVertices(); // the two vertices at the ends of this edge

        return buildings.stream()
                .filter(b -> b.getOwnerId().equals(playerId))
                .anyMatch(building -> {
                    // a settlement/city on one of the endpoints
                    if (building.getLocation() instanceof Vertex v && endpoints.contains(v)) {
                        return true;
                    }
                    // another road that shares a vertex with this edge
                    if (building.getLocation() instanceof Edge otherEdge) {
                        List<Vertex> otherEndpoints = otherEdge.getVertices();
                        for (Vertex ep : endpoints) {
                            if (otherEndpoints.contains(ep)) {
                                return true;
                            }
                        }
                    }
                    return false;
                });
    }

    public Building<Vertex> upgradeSettlement(Vertex vertex, UUID playerId) {
        validateBoardCity(vertex, playerId); // now private
        Building<Vertex> city = Building.city(playerId, vertex);
        buildings.add(city);
        return city;
    }

    private void validateBoardCity(Vertex vertex, UUID playerId) {
        // 1. There must be a settlement at this vertex...
        Building<?> existing = getBuildingAt(vertex)
                .orElseThrow(() -> new NoSettlementToUpgradeException(vertex));

        // 2. ...owned by this player...
        if (!existing.getOwnerId().equals(playerId)) {
            throw new NotOwnerException(vertex, playerId);
        }

        // 3. ...and it must actually be a settlement, not already a city
        if (existing.getKind() != PieceType.SETTLEMENT) {
            throw new AlreadyCityException(vertex, existing);
        }
    }

    public void moveRobber(Hex target) {
        validateBoardRobber(target);
        Tile robbedTile = getRobbedTile();
        robbedTile.removeRobber();
        Tile newRobbedTile = getTileAt(target);
        newRobbedTile.setRobbed();
    }

    private void validateBoardRobber(Hex hex) {
        Tile tile = getTileAt(hex);

        if (tile.hasRobber()) {
            throw new TileAlreadyRobbedException(tile);
        }

        if (tile.getKind().equals(TileKind.SEA)) {
            throw new InvalidHexException(hex);
        }
    }

    public Tile getRobbedTile() {
        return tiles
                .stream()
                .filter(Tile::hasRobber)
                .findFirst()
                .orElseThrow(() -> new NoRobbedTileException("Called inside getRobbedTile"));
    }

    public List<Tile> tilesProducingOn(int rollTotal) {
        return tiles.stream()
                .filter(t -> t.getNumber() != null && t.getNumber().equals(rollTotal) && !t.hasRobber())
                .toList();
    }

    public long countSettlements(UUID playerId) {
        return buildings
                .stream()
                .filter(b -> b.getKind() == PieceType.SETTLEMENT && b.getOwnerId() == playerId)
                .count();
    }

    public long countCities(UUID playerId) {
        return buildings
                .stream()
                .filter(b -> b.getKind() == PieceType.CITY && b.getOwnerId() == playerId)
                .count();
    }

    public long countRoads(UUID playerId) {
        return buildings
                .stream()
                .filter(b -> b.getKind() == PieceType.ROAD && b.getOwnerId() == playerId)
                .count();
    }

    public int longestRoadLength(UUID playerId) {
        List<Edge> playerRoads = buildings.stream()
                .filter(b -> b.getOwnerId().equals(playerId))
                .filter(b -> b.getLocation() instanceof Edge)
                .map(b -> (Edge) b.getLocation())
                .toList();

        Set<Vertex> blockedVertices = buildings.stream()
                .filter(b -> !b.getOwnerId().equals(playerId))
                .filter(b -> b.getLocation() instanceof Vertex)
                .map(b -> (Vertex) b.getLocation())
                .collect(Collectors.toSet());

        return new LongestRoadCalculator(playerRoads, blockedVertices).longestPathLength();
    }

    public boolean isEdgeBuildable(Edge edge) {
        return edge.hexes().stream().anyMatch(this::isLandHex);
    }

    private boolean isLandHex(Hex hex) {
        return tiles.stream()
                .filter(t -> t.getHex().equals(hex))
                .findFirst()
                .map(t -> t.getKind() != TileKind.SEA)
                .orElse(false);
    }

    private Set<Hex> tileHexes() {
        return tiles.stream().map(Tile::getHex).collect(Collectors.toSet());
    }

    private Set<Edge> allEdges() {
        Set<Hex> hexSet = tileHexes();
        Set<Edge> edges = new HashSet<>();
        for (Tile tile : tiles) {
            Hex hex = tile.getHex();
            for (int dir = 0; dir < 6; dir++) {
                Hex neighbor = hex.neighbor(dir);
                if (hexSet.contains(neighbor)) {
                    Edge edge = Edge.of(hex, neighbor);
                    if (isEdgeBuildable(edge)) {
                        edges.add(edge);
                    }
                }
            }
        }
        return edges;
    }

    public int maxPlaceableRoads(UUID playerId, int limit) {
        if (limit <= 0) return 0;

        Set<Edge> candidates = allEdges().stream()
                .filter(e -> !isEdgeOccupied(e))
                .collect(Collectors.toSet());

        return searchMaxRoads(playerId, candidates, Set.of(), limit);
    }

    private int searchMaxRoads(UUID playerId, Set<Edge> candidates, Set<Edge> chosen, int limit) {
        if (chosen.size() >= limit) return chosen.size();

        int best = chosen.size();
        for (Edge candidate : candidates) {
            if (chosen.contains(candidate)) continue;
            if (!isEdgeConnectedToPlayerOrHypothetical(playerId, candidate, chosen)) continue;

            Set<Edge> next = new HashSet<>(chosen);
            next.add(candidate);
            best = Math.max(best, searchMaxRoads(playerId, candidates, next, limit));
            if (best >= limit) break; // maximum achievable already proven — stop searching
        }
        return best;
    }

    private boolean isEdgeConnectedToPlayerOrHypothetical(UUID playerId, Edge edge, Set<Edge> hypothetical) {
        if (isEdgeConnectedToPlayerNetwork(edge, playerId)) return true;

        List<Vertex> endpoints = edge.getVertices();
        return hypothetical.stream()
                .anyMatch(other -> other.getVertices().stream().anyMatch(endpoints::contains));
    }

    public int getBestTradeRatio(UUID playerId, ResourceType resourceType) {
        int best = 4;

        for (Tile tile : tiles) {
            if (!tile.isPort()) continue;

            Edge harborEdge = Edge.of(tile.getHex(), tile.getHex().neighbor(tile.getPortFacing()));
            for (Vertex vertex : harborEdge.getVertices()) {
                Building<?> building = getBuildingAt(vertex).orElse(null);
                if (building == null || !building.getOwnerId().equals(playerId)) continue;

                PortType portType = tile.getPortType();
                if (portType == PortType.ANY) {
                    best = Math.min(best, 3);
                } else if (portType.getResourceType() == resourceType) {
                    best = Math.min(best, 2);
                }
            }
        }
        return best;
    }
}
