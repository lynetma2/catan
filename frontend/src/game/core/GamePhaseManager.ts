// core/GamePhaseManager.ts
import type {SharedState} from "@/game/core/SharedState.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import {type GameServerEventMap, GameServerEvents} from "@/events/game/GameServerEvents.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";

export class GamePhaseManager {
    constructor(
        private readonly bus: EventBus<GameEventMap>,
        private readonly shared: SharedState,
    ) {
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        this.bus.on(GameServerEvents.state.full.success, payload => this.onGameStateLoaded(payload));
        // this.bus.on(GameEventType.GAME_STATE_LOADED,     e => this.onGameStateLoaded(e.payload));
        // this.bus.on(GameEventType.TURN_STARTED,         e => this.onTurnStarted(e.payload));
        // this.bus.on(GameEventType.TURN_ENDED,           e => this.onTurnEnded(e.payload));
        // this.bus.on(GameEventType.DICE_ROLLED,          e => this.onDiceRolled(e.payload));
        // this.bus.on(GameEventType.ROBBER_PLACED,        e => this.onRobberPlaced(e.payload));
        // this.bus.on(GameEventType.ROBBER_STEAL_COMPLETE, e => this.onRobberStealComplete(e.payload));
        // this.bus.on(GameEventType.SETUP_TURN_COMPLETED,  e => this.onSetupTurnCompleted(e.payload));
        // this.bus.on(GameEventType.PHASE_ADVANCED,       e => this.onPhaseAdvanced(e.payload));
        // this.bus.on(GameEventType.GAME_ENDED,           _e => this.shared.setCurrentPhase(GamePhase.End));
        // this.bus.on(GameEventType.DISCARD_REQUIRED,    e => this.onDiscardRequired(e.payload));
        this.bus.on(GameServerEvents.state.phase.change.success, payload => this.onPhaseAdvanced(payload));
    }

    private onGameStateLoaded(payload: GameServerEventMap[typeof GameServerEvents.state.full.success]) {
        this.shared.setCurrentPhase(payload.snapshot.currentPhase);
        this.shared.setCurrentPlayer(payload.snapshot.currentPlayerId);
    }

    // private onTurnStarted(payload: EventPayloads[GameEventType.TURN_STARTED]) {
    //     this.shared.setCurrentPlayer(payload.playerId);
    //     this.shared.setCurrentPhase(GamePhase.PreRoll);
    // }
    //
    // private onTurnEnded(_payload: EventPayloads[GameEventType.TURN_ENDED]) {
    //     // Server fires TURN_STARTED for next player
    // }
    //
    // private onDiceRolled(payload: EventPayloads[GameEventType.DICE_ROLLED]) {
    //     this.shared.setCurrentPhase(
    //         payload.total === 7
    //             ? GamePhase.RobberPlacement
    //             : GamePhase.PostRoll
    //     );
    // }
    //
    // private onRobberPlaced(_payload: EventPayloads[GameEventType.ROBBER_PLACED]) {
    //     this.shared.setCurrentPhase(GamePhase.RobberSteal);
    // }
    //
    // private onRobberStealComplete(_payload: EventPayloads[GameEventType.ROBBER_STEAL_COMPLETE]) {
    //     this.shared.setCurrentPhase(GamePhase.PostRoll);
    // }
    //
    // private onSetupTurnCompleted(_payload: EventPayloads[GameEventType.SETUP_TURN_COMPLETED]) {
    //     // Server determines next phase
    // }

    private onPhaseAdvanced(payload: GameServerEventMap[typeof GameServerEvents.state.phase.change.success]) {
        this.shared.setCurrentPhase(payload.phase);
    }

    // private onDiscardRequired(payload: EventPayloads[GameEventType.DISCARD_REQUIRED]) {
    //     if (payload.playerId !== this.shared.localPlayerId) return;
    //     this.shared.setMustDiscard(payload.amount);
    // }
}