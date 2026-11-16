package com.sundtrack.catan.game.application.handler;

import com.sundtrack.catan.game.application.GameContext;
import com.sundtrack.catan.shared.event.EventResult;
import com.sundtrack.catan.shared.event.ServerEvent;
import com.sundtrack.catan.game.domain.event.action.GameStateAction;
import com.sundtrack.catan.game.domain.event.server.state.GameFullStateEvent;
import com.sundtrack.catan.game.domain.Game;
import com.sundtrack.catan.game.dto.mapper.GameMapper;
import com.sundtrack.catan.shared.ws.HandlesEvent;
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
