package com.sundtrack.catan.session.game.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.GameStateAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.GameFullStateEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.dto.mapper.GameMapper;
import com.sundtrack.catan.messaging.HandlesEvent;
import com.sundtrack.catan.session.game.services.GameStore;
import org.springframework.stereotype.Component;

@Component
@HandlesEvent(GameStateAction.class)
public class GameStateHandler implements GameActionHandler<GameStateAction> {
    private final GameStore gameStore;
    private final GameMapper gameMapper;

    public GameStateHandler(GameStore gameStore, GameMapper gameMapper) {
        this.gameStore = gameStore;
        this.gameMapper = gameMapper;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, GameStateAction action) {
        Game game = gameStore.get(context.gameId());

        return EventResult.directed(context.playerId(), new GameFullStateEvent(gameMapper.toSnapshotDTO(game)));
    }
}
