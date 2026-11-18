package com.sundtrack.catan.game.domain;

import com.sundtrack.catan.game.domain.building.PieceType;
import com.sundtrack.catan.shared.event.ClientAction;
import com.sundtrack.catan.game.domain.subFlows.*;

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

    public static GameFlow restore(TurnOrder turnOrder, GamePhase basePhase, int turnNumber, Deque<SubFlow> activeFlows) {
        GameFlow flow = new GameFlow(turnOrder, turnNumber);
        flow.basePhase = basePhase;
        flow.activeFlows.clear(); // Remove the auto-pushed SetupFlow
        flow.activeFlows.addAll(activeFlows);
        return flow;
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

    public void enterGameOver() {
        basePhase = GamePhase.GAME_OVER;
        activeFlows.clear();
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

    public Optional<RoadBuildingFlow> getActiveRoadBuildingFlow() {
        return activeFlows
                .stream()
                .filter(RoadBuildingFlow.class::isInstance)
                .map(RoadBuildingFlow.class::cast)
                .findFirst();
    }

    public boolean isFinalSetupRound() {
        return turnOrder.isFinalSetupRound();
    }

    public TurnOrder getTurnOrder() { return turnOrder; }
    public GamePhase getBasePhase() { return basePhase; }
    public Deque<SubFlow> getActiveFlows() { return new ArrayDeque<>(activeFlows); }  // Defensive copy

    public record TurnAdvanceResult(UUID previousPlayerId, UUID newCurrentPlayerId, int newTurnNumber,
                                    GamePhase initialPhase) {
    }
}
