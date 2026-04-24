package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.board.tile.Tile;
import com.sundtrack.catan.datalayer.domain.building.Building;
import com.sundtrack.catan.datalayer.domain.event.GameEvent;
import com.sundtrack.catan.datalayer.domain.trade.TradeOffer;
import com.sundtrack.catan.session.lobby.Lobby;

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
}
