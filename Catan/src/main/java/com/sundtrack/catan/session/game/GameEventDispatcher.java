package com.sundtrack.catan.session.game;

import org.springframework.stereotype.Component;

@Component  // not @Service — it has no business logic, just routing
public class GameEventDispatcher {
//    private final BuildService buildService;
//    private final TurnService turnService;
//    private final TradeService tradeService;
//    private final RobberService robberService;
//
//    public GameOutEvent dispatch(Game game, GameEvent event) {
//        return switch (event) {
//            case BuildRoadEvent e -> buildService.buildRoad(game, e);
//            case RollDiceEvent e  -> turnService.rollDice(game, e);
//            case EndTurnEvent e   -> turnService.endTurn(game, e);
//        };
//    }
}
