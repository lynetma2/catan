package com.sundtrack.catan.session.game.eventHandlers;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.GameStateAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GameFullStateEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.dto.mapper.GameMapper;
import com.sundtrack.catan.messaging.HandlesEvent;
import org.springframework.stereotype.Component;

@Component
@HandlesEvent(GameStateAction.class)
public class GameStateHandler implements GameActionHandler<GameStateAction> {
    private final GameMapper gameMapper;

    public GameStateHandler(GameMapper gameMapper) {
        this.gameMapper = gameMapper;
    }

    @Override
    public EventResult<ServerEvent> handle(GameContext context, Game game, GameStateAction action) {
        return EventResult.directed(context.playerId(), new GameFullStateEvent(context.gameId(), gameMapper.toSnapshotDTO(game, context.playerId()), context.playerId()));
    }
}
