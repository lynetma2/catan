package com.sundtrack.catan.datalayer.domain.game;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public class GameFlow {

    private final TurnOrder turnOrder;
    private final DiscardSession discardSession;
    private final StealSession stealSession;
    private GamePhase currentPhase;
    private Integer turnNumber;

    public GameFlow(GamePhase currentPhase, TurnOrder turnOrder, Integer turnNumber) {
        this.currentPhase = currentPhase;
        this.turnOrder = turnOrder;
        this.turnNumber = turnNumber;
        this.discardSession = new DiscardSession();
        this.stealSession = new StealSession();
    }

    public GamePhase getCurrentPhase() {
        return currentPhase;
    }

    public Integer getTurnNumber() {
        return turnNumber;
    }

    public UUID getCurrentPlayerId() {
        return turnOrder.currentPlayerId();
    }

    public DiscardSession getDiscardSession() {
        return discardSession;
    }

    public StealSession getStealSession() {
        return stealSession;
    }

    public Optional<GamePhase> advanceAfterSettlement() {
        if (currentPhase != GamePhase.SETUP_PLACE_SETTLEMENT) {
            return Optional.empty(); // settlements outside setup don't change phase
        }
        currentPhase = GamePhase.SETUP_PLACE_ROAD;
        return Optional.of(currentPhase);
    }

    public Optional<PhaseAdvanceResult> advanceAfterRoad() {
        if (currentPhase != GamePhase.SETUP_PLACE_ROAD) {
            return Optional.empty();
        }

        TurnOrder.SetupAdvanceResult advanceResult = turnOrder.advanceSetup();

        currentPhase = switch (advanceResult) {
            case SETUP_COMPLETE -> GamePhase.PRE_ROLL;
            case SAME_PLAYER_AGAIN, NEXT_PLAYER -> GamePhase.SETUP_PLACE_SETTLEMENT;
        };

        boolean turnPassed = advanceResult != TurnOrder.SetupAdvanceResult.SAME_PLAYER_AGAIN;

        return Optional.of(new PhaseAdvanceResult(currentPhase, turnPassed, turnOrder.currentPlayerId()));
    }

    public GamePhase advanceAfterEndTurn() {
        return currentPhase = GamePhase.PRE_ROLL;
    }

    public GamePhase advanceAfterGrantResources() {
        return currentPhase = GamePhase.POST_ROLL;
    }

    // Takes the decision input rather than computing it — GameFlow has no access to `players`
    // and shouldn't need it; Game computes required discards and hands over the result.
    public SevenRolledAdvanceResult advanceAfterSevenRoll(Map<UUID, Integer> requiredDiscards) {
        if (requiredDiscards.isEmpty()) {
            currentPhase = GamePhase.ROBBER_PLACEMENT;
            return new SevenRolledAdvanceResult(currentPhase, Optional.empty());
        }
        discardSession.activate(requiredDiscards);
        currentPhase = GamePhase.DISCARD;
        return new SevenRolledAdvanceResult(currentPhase, Optional.of(discardSession));
    }

    // Same pattern: Game computes stealCandidates via Board + players, GameFlow just
    // decides the resulting phase and manages stealSession lifecycle.
    public RobberPlacedAdvanceResult advanceAfterRobberPlacement(UUID retrievingPlayerId, List<UUID> stealCandidates) {
        stealSession.activate(retrievingPlayerId, stealCandidates);
        currentPhase = stealCandidates.isEmpty() ? GamePhase.POST_ROLL : GamePhase.ROBBER_STEAL;
        return new RobberPlacedAdvanceResult(currentPhase, stealCandidates);
    }

    public GamePhase advanceAfterRobberSteal() {
        stealSession.deactivate();
        return currentPhase = GamePhase.POST_ROLL;
    }

    public TurnAdvanceResult advanceTurn() {
        UUID previousPlayerId = turnOrder.currentPlayerId();
        turnOrder.advance();
        turnNumber++;
        currentPhase = GamePhase.PRE_ROLL;
        return new TurnAdvanceResult(previousPlayerId, turnOrder.currentPlayerId(), turnNumber, currentPhase);
    }

    public boolean isSetupPhase() {
        return currentPhase.isSetupPhase();
    }

    public record PhaseAdvanceResult(GamePhase newPhase, boolean turnPassed, UUID newCurrentPlayerId) {
    }

    public record TurnAdvanceResult(UUID previousPlayerId, UUID newCurrentPlayerId, int newTurnNumber,
                                    GamePhase initialPhase) {
    }

    public record SevenRolledAdvanceResult(GamePhase gamePhase, Optional<DiscardSession> discardSession) {
    }

    public record RobberPlacedAdvanceResult(GamePhase gamePhase, List<UUID> candidates) {
    }
}
