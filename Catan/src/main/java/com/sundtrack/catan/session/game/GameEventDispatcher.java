package com.sundtrack.catan.session.game;

import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.inbound.GameStartRequestedEvent;
import com.sundtrack.catan.datalayer.domain.event.inbound.InboundGameEvent;
import com.sundtrack.catan.datalayer.domain.event.outbound.OutboundGameEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import org.springframework.stereotype.Component;

@Component
public class GameEventDispatcher {
//    private final BuildService buildService;
//    private final TurnService turnService;
//    private final TradeService tradeService;
//    private final RobberService robberService;

    public EventResult dispatch(Game game, InboundGameEvent event) {
        return switch (event) {
            //case BuildRoadEvent e -> buildService.buildRoad(game, e);
            //case RollDiceEvent e  -> turnService.rollDice(game, e);
            //case EndTurnEvent e   -> turnService.endTurn(game, e);
            case GameStartRequestedEvent e ->
        };
    }
}
