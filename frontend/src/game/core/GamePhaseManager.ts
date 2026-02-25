// core/GamePhaseManager.ts
import {type EventPayloads, GameEventType} from "@/game/events/GameEventTypes.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import {GamePhase} from "@/game/core/types.ts";

export class GamePhaseManager {
    constructor(
        private readonly bus:    EventBus,
        private readonly shared: SharedState,
    ) {
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        this.bus.on(GameEventType.GameStateLoaded,     e => this.onGameStateLoaded(e.payload));
        this.bus.on(GameEventType.TurnStarted,         e => this.onTurnStarted(e.payload));
        this.bus.on(GameEventType.TurnEnded,           e => this.onTurnEnded(e.payload));
        this.bus.on(GameEventType.DiceRolled,          e => this.onDiceRolled(e.payload));
        this.bus.on(GameEventType.RobberPlaced,        e => this.onRobberPlaced(e.payload));
        this.bus.on(GameEventType.RobberStealComplete, e => this.onRobberStealComplete(e.payload));
        this.bus.on(GameEventType.SetupTurnCompleted,  e => this.onSetupTurnCompleted(e.payload));
        this.bus.on(GameEventType.PhaseAdvanced,       e => this.onPhaseAdvanced(e.payload));
        this.bus.on(GameEventType.GameEnded,           _e => this.shared.setCurrentPhase(GamePhase.End));
        this.bus.on(GameEventType.DISCARD_REQUIRED,    e => this.onDiscardRequired(e.payload));
    }

    private onGameStateLoaded(payload: EventPayloads[GameEventType.GameStateLoaded]) {
        this.shared.setCurrentPhase((payload.currentPhase);
        this.shared.setCurrentPlayer(payload.currentPlayerId);
    }

    private onTurnStarted(payload: EventPayloads[GameEventType.TurnStarted]) {
        this.shared.setCurrentPlayer(payload.playerId);
        this.shared.setCurrentPhase(GamePhase.PreRoll);
    }

    private onTurnEnded(_payload: EventPayloads[GameEventType.TurnEnded]) {
        // Server fires TURN_STARTED for next player
    }

    private onDiceRolled(payload: EventPayloads[GameEventType.DiceRolled]) {
        this.shared.setCurrentPhase(
            payload.total === 7
                ? GamePhase.RobberPlacement
                : GamePhase.PostRoll
        );
    }

    private onRobberPlaced(_payload: EventPayloads[GameEventType.RobberPlaced]) {
        this.shared.setCurrentPhase(GamePhase.RobberSteal);
    }

    private onRobberStealComplete(_payload: EventPayloads[GameEventType.RobberStealComplete]) {
        this.shared.setCurrentPhase(GamePhase.PostRoll);
    }

    private onSetupTurnCompleted(_payload: EventPayloads[GameEventType.SetupTurnCompleted]) {
        // Server determines next phase
    }

    private onPhaseAdvanced(payload: EventPayloads[GameEventType.PhaseAdvanced]) {
        this.shared.setCurrentPhase(payload.phase);
    }

    private onDiscardRequired(payload: EventPayloads[GameEventType.DISCARD_REQUIRED]) {
        if (payload.playerId !== this.shared.localPlayerId) return;
        this.shared.setMustDiscard(payload.amount);
    }
}