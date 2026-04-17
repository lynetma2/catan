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
        this.bus.on(GameEventType.GAME_STATE_LOADED,     e => this.onGameStateLoaded(e.payload));
        this.bus.on(GameEventType.TURN_STARTED,         e => this.onTurnStarted(e.payload));
        this.bus.on(GameEventType.TURN_ENDED,           e => this.onTurnEnded(e.payload));
        this.bus.on(GameEventType.DICE_ROLLED,          e => this.onDiceRolled(e.payload));
        this.bus.on(GameEventType.ROBBER_PLACED,        e => this.onRobberPlaced(e.payload));
        this.bus.on(GameEventType.ROBBER_STEAL_COMPLETE, e => this.onRobberStealComplete(e.payload));
        this.bus.on(GameEventType.SETUP_TURN_COMPLETED,  e => this.onSetupTurnCompleted(e.payload));
        this.bus.on(GameEventType.PHASE_ADVANCED,       e => this.onPhaseAdvanced(e.payload));
        this.bus.on(GameEventType.GAME_ENDED,           _e => this.shared.setCurrentPhase(GamePhase.End));
        this.bus.on(GameEventType.DISCARD_REQUIRED,    e => this.onDiscardRequired(e.payload));
    }

    private onGameStateLoaded(payload: EventPayloads[GameEventType.GAME_STATE_LOADED]) {
        this.shared.setCurrentPhase(payload.currentPhase);
        this.shared.setCurrentPlayer(payload.currentPlayerId);
    }

    private onTurnStarted(payload: EventPayloads[GameEventType.TURN_STARTED]) {
        this.shared.setCurrentPlayer(payload.playerId);
        this.shared.setCurrentPhase(GamePhase.PreRoll);
    }

    private onTurnEnded(_payload: EventPayloads[GameEventType.TURN_ENDED]) {
        // Server fires TURN_STARTED for next player
    }

    private onDiceRolled(payload: EventPayloads[GameEventType.DICE_ROLLED]) {
        this.shared.setCurrentPhase(
            payload.total === 7
                ? GamePhase.RobberPlacement
                : GamePhase.PostRoll
        );
    }

    private onRobberPlaced(_payload: EventPayloads[GameEventType.ROBBER_PLACED]) {
        this.shared.setCurrentPhase(GamePhase.RobberSteal);
    }

    private onRobberStealComplete(_payload: EventPayloads[GameEventType.ROBBER_STEAL_COMPLETE]) {
        this.shared.setCurrentPhase(GamePhase.PostRoll);
    }

    private onSetupTurnCompleted(_payload: EventPayloads[GameEventType.SETUP_TURN_COMPLETED]) {
        // Server determines next phase
    }

    private onPhaseAdvanced(payload: EventPayloads[GameEventType.PHASE_ADVANCED]) {
        this.shared.setCurrentPhase(payload.phase);
    }

    private onDiscardRequired(payload: EventPayloads[GameEventType.DISCARD_REQUIRED]) {
        if (payload.playerId !== this.shared.localPlayerId) return;
        this.shared.setMustDiscard(payload.amount);
    }
}