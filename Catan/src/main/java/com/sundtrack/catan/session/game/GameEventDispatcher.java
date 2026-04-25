package com.sundtrack.catan.session.game;

import com.sundtrack.catan.datalayer.domain.board.Hex;
import com.sundtrack.catan.datalayer.domain.board.Vertex;
import com.sundtrack.catan.datalayer.domain.building.BuildingKind;
import com.sundtrack.catan.datalayer.domain.event.EventResult;
import com.sundtrack.catan.datalayer.domain.event.game.inbound.GameStartRequestedEvent;
import com.sundtrack.catan.datalayer.domain.event.game.inbound.InboundGameEvent;
import com.sundtrack.catan.datalayer.domain.event.game.outbound.BuildPlacedEvent;
import com.sundtrack.catan.datalayer.domain.event.game.outbound.OutboundGameEvent;
import com.sundtrack.catan.datalayer.domain.event.lobby.outbound.LobbyCreatedEvent;
import com.sundtrack.catan.datalayer.domain.game.Game;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GameEventDispatcher {
//    private final BuildService buildService;
//    private final TurnService turnService;
//    private final TradeService tradeService;
//    private final RobberService robberService;

    public EventResult<OutboundGameEvent> dispatch(Game game, InboundGameEvent event) {
        //return switch (event) {
        //case BuildRoadEvent e -> buildService.buildRoad(game, e);
        //case RollDiceEvent e  -> turnService.rollDice(game, e);
        //case EndTurnEvent e   -> turnService.endTurn(game, e);
        //};
        return null;
    }
}
