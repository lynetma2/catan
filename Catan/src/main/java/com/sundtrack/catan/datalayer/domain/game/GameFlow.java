package com.sundtrack.catan.datalayer.domain.game;

import com.sundtrack.catan.datalayer.domain.building.PieceType;
import com.sundtrack.catan.datalayer.domain.event.ClientAction;
import com.sundtrack.catan.datalayer.domain.game.subFlows.DiscardFlow;
import com.sundtrack.catan.datalayer.domain.game.subFlows.RobberStealFlow;
import com.sundtrack.catan.datalayer.domain.game.subFlows.SetupFlow;
import com.sundtrack.catan.datalayer.domain.game.subFlows.SubFlow;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Optional;
import java.util.UUID;

public class GameFlow {

    private final TurnOrder turnOrder;
    private final Deque<SubFlow> activeFlows = new ArrayDeque<>();
    private GamePhase basePhase;
    private Integer turnNumber;

    public GameFlow(TurnOrder turnOrder, Integer turnNumber) {
        this.turnOrder = turnOrder;
        this.turnNumber = turnNumber;
        this.basePhase = GamePhase.PRE_ROLL; //Initial phase after the subflow ends
        this.activeFlows.push(SetupFlow.start(turnOrder));
    }

    public GamePhase getCurrentPhase() {
        return activeFlows.isEmpty() ? basePhase : activeFlows.peek().currentPhase();
    }

    public boolean isInSubFlow() {
        return !activeFlows.isEmpty();
    }

    public boolean isFreePlacement(PieceType pieceType) {
        return !activeFlows.isEmpty() && activeFlows.peek().isFreePlacement(pieceType);
    }

    public Integer getTurnNumber() {
        return turnNumber;
    }

    public UUID getCurrentPlayerId() {
        return turnOrder.currentPlayerId();
    }

    public void dispatch(ClientAction action, UUID actingPlayerId) {
        if (activeFlows.isEmpty()) {
            throw new IllegalStateException("No active subflow for " + action.getClass().getSimpleName());
        }
        SubFlow current = activeFlows.pop();
        current.handle(action, actingPlayerId).ifPresent(activeFlows::push);
    }

    public void startSubFlow(SubFlow subFlow) {
        activeFlows.push(subFlow);
    }

    public void enterPostRoll() {
        basePhase = GamePhase.POST_ROLL;
    }

    public TurnAdvanceResult advanceTurn() {
        UUID previousPlayerId = turnOrder.currentPlayerId();
        turnOrder.advance();
        turnNumber++;
        basePhase = GamePhase.PRE_ROLL;
        return new TurnAdvanceResult(previousPlayerId, turnOrder.currentPlayerId(), turnNumber, basePhase);
    }

    public Optional<DiscardFlow> getActiveDiscardFlow() {
        return activeFlows
                .stream()
                .filter(DiscardFlow.class::isInstance)
                .map(DiscardFlow.class::cast)
                .findFirst();
    }

    public Optional<RobberStealFlow> getActiveStealFlow() {
        return activeFlows
                .stream()
                .filter(RobberStealFlow.class::isInstance)
                .map(RobberStealFlow.class::cast)
                .findFirst();
    }

    public record TurnAdvanceResult(UUID previousPlayerId, UUID newCurrentPlayerId, int newTurnNumber,
                                    GamePhase initialPhase) {
    }
}
