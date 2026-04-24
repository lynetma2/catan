package com.sundtrack.catan.session.game.services.interfaces;

import java.util.UUID;

public interface GameService {
    // Game lifecycle
    GameDTO createGame(CreateGameRequest request);
    GameDTO joinGame(UUID gameId, UUID playerId);
    GameDTO startGame(UUID gameId);
    void   abandonGame(UUID gameId);
    GameDTO getGameState(UUID gameId, UUID playerId);
}
