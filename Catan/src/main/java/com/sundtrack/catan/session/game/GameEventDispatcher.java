package com.sundtrack.catan.session.game;

import com.sundtrack.catan.common.PrincipalUtils;
import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.ServerEvent;
import com.sundtrack.catan.datalayer.domain.event.game.action.GameStateAction;
import com.sundtrack.catan.datalayer.domain.event.game.server.state.GameFullStateEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import com.sundtrack.catan.datalayer.dto.mapper.GameMapper;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.UUID;

@Component
public class GameEventDispatcher {
    //    private final BuildService buildService;
//    private final TurnService turnService;
//    private final TradeService tradeService;
//    private final RobberService robberService;
    private final GameMapper gameMapper;

    public GameEventDispatcher(GameMapper gameMapper) {
        this.gameMapper = gameMapper;
    }

    public EventResult<ServerEvent> dispatch(Game game, ClientAction event, Principal principal) {
        UUID playerId = PrincipalUtils.extractPlayerId(principal);
        return switch (event) {
            case GameStateAction e ->
                    EventResult.directed(playerId, new GameFullStateEvent(UUID.randomUUID(), gameMapper.toSnapshotDTO(game, playerId), UUID.randomUUID())); //TODO hide player specific information.
            //case BuildRoadEvent e -> buildService.buildRoad(game, e);
            //case RollDiceEvent e  -> turnService.rollDice(game, e);
            //case EndTurnEvent e   -> turnService.endTurn(game, e);
            default -> throw new IllegalStateException("Unexpected value: " + event);
        };
    }
}
