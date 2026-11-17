package com.sundtrack.catan.game.persistence;

import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.persistence.state.GameStateDocument;
import org.springframework.stereotype.Component;

@Component
class GameStateCodec {

    public GameStateDocument toDocument(Game game) {
        // TODO: extract full lossless state (players, board, flow, banks, trades, deck)
        throw new UnsupportedOperationException("toDocument not implemented yet");
    }

    public Game toGame(GameStateDocument document) {
        // TODO: reconstruct a Game identical to the original
        throw new UnsupportedOperationException("toGame not implemented yet");
    }
}