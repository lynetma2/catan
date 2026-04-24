package com.sundtrack.catan.session.game.services.interfaces;

import java.util.UUID;

public interface GameService {
    // Game lifecycle
    GameDTO createGame(CreateGameRequest request);
    GameDTO joinGame(UUID gameId, UUID playerId);
    GameDTO startGame(UUID gameId);
    void   abandonGame(UUID gameId);
    GameDTO getGameState(UUID gameId, UUID playerId);

    // Turn structure
    GameDTO rollDice(UUID gameId, UUID playerId);
    GameDTO endTurn(UUID gameId, UUID playerId);

    // Player actions
    GameDTO buildRoad(UUID gameId, UUID playerId, EdgeLocation edge);
    GameDTO buildSettlement(UUID gameId, UUID playerId, VertexLocation vertex);
    GameDTO buildCity(UUID gameId, UUID playerId, VertexLocation vertex);
    GameDTO buyDevelopmentCard(UUID gameId, UUID playerId);
    GameDTO playDevelopmentCard(UUID gameId, UUID playerId, DevelopmentCardRequest request);

    // Trading
    GameDTO offerTrade(UUID gameId, UUID playerId, TradeOffer offer);
    GameDTO respondToTrade(UUID gameId, UUID playerId, UUID offerId, boolean accept);
    GameDTO tradeWithBank(UUID gameId, UUID playerId, BankTradeRequest request);

    // Robber
    GameDTO moveRobber(UUID gameId, UUID playerId, HexLocation hex);
    GameDTO stealResource(UUID gameId, UUID playerId, UUID targetPlayerId);
    GameDTO discardResources(UUID gameId, UUID playerId, ResourceBundle toDiscard);
}
