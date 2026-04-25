package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.board.tile.Tile;
import com.sundtrack.catan.datalayer.domain.building.Building;
import com.sundtrack.catan.datalayer.domain.trade.TradeOffer;

import java.util.List;
import java.util.UUID;

public class Game {
    private UUID id;
    private List<GamePlayer> players;
    private List<Tile> tiles;
    private List<Building<?>> buildings;
    private GamePhase currentPhase;
    private Integer turnNumber;
    private List<TradeOffer> activeTradeOffers;
    private List<GameEvent> gameEvents;

    public Game(List<GamePlayer> players, List<Tile> tiles, List<Building<?>> buildings, GamePhase currentPhase, Integer turnNumber, List<TradeOffer> activeTradeOffers, List<GameEvent> gameEvents) {
        this.id = UUID.randomUUID();
        this.players = players;
        this.tiles = tiles;
        this.buildings = buildings;
        this.currentPhase = currentPhase;
        this.turnNumber = turnNumber;
        this.activeTradeOffers = activeTradeOffers;
        this.gameEvents = gameEvents;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public List<GamePlayer> getPlayers() {
        return players;
    }

    public void setPlayers(List<GamePlayer> players) {
        this.players = players;
    }

    public List<Tile> getTiles() {
        return tiles;
    }

    public void setTiles(List<Tile> tiles) {
        this.tiles = tiles;
    }

    public List<Building<?>> getBuildings() {
        return buildings;
    }

    public void setBuildings(List<Building<?>> buildings) {
        this.buildings = buildings;
    }

    public GamePhase getCurrentPhase() {
        return currentPhase;
    }

    public void setCurrentPhase(GamePhase currentPhase) {
        this.currentPhase = currentPhase;
    }

    public Integer getTurnNumber() {
        return turnNumber;
    }

    public void setTurnNumber(Integer turnNumber) {
        this.turnNumber = turnNumber;
    }

    public List<TradeOffer> getActiveTradeOffers() {
        return activeTradeOffers;
    }

    public void setActiveTradeOffers(List<TradeOffer> activeTradeOffers) {
        this.activeTradeOffers = activeTradeOffers;
    }

    public List<GameEvent> getGameEvents() {
        return gameEvents;
    }

    public void setGameEvents(List<GameEvent> gameEvents) {
        this.gameEvents = gameEvents;
    }
}
