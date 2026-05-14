package com.sundtrack.catan.session.game.services.interfaces;

import com.sundtrack.catan.datalayer.domain.game.Game;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface GameCreationService {
    // Game lifecycle
    Game createGame(UUID id);
}
