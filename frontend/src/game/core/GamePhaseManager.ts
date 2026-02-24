// core/GamePhaseManager.ts
import { type EventBus }    from '@/game/core/EventBus';
import { type SharedState } from '@/game/core/SharedState';
import { type EventPayloads } from '@/game/events/GameEventTypes';
import { GameEventType }    from '@/game/events/GameEventTypes';
import {GamePhase} from "@/game/core/types.ts";

export class GamePhaseManager {

    constructor(
        private readonly bus:    EventBus,
        private readonly shared: SharedState,
    ) {
        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        this.bus.on(GameEventType.GAME_STATE_LOADED,     e => this.onGameStateLoaded(e.payload));
        this.bus.on(GameEventType.PhaseAdvanced,       e => this.onPhaseAdvanced(e.payload));
        this.bus.on(GameEventType.TURN_STARTED,         e => this.onTurnStarted(e.payload));
        this.bus.on(GameEventType.TURN_ENDED,           e => this.onTurnEnded(e.payload));
        this.bus.on(GameEventType.DICE_ROLLED,          e => this.onDiceRolled(e.payload));
        this.bus.on(GameEventType.RobberPlaced,        e => this.onRobberPlaced(e.payload));
        this.bus.on(GameEventType.RobberStealComplete, e => this.onRobberStealComplete(e.payload));
        this.bus.on(GameEventType.SetupTurnCompleted,  e => this.onSetupTurnCompleted(e.payload));
        this.bus.on(GameEventType.GameEnded,           e => this.onGameEnded(e.payload));
    }

    // ─── Event handlers ───────────────────────────────────────────────

    private onGameStateLoaded(payload: EventPayloads[GameEventType.GAME_STATE_LOADED]) {
        this.phase           = payload.currentPhase;
        this.currentPlayerId = payload.currentPlayerId;
        this.shared.setCurrentPlayer(payload.currentPlayerId);
        this.shared.setCurrentPhase(payload.currentPhase);
    }

    private onPhaseAdvanced(payload: EventPayloads[GameEventType.PhaseAdvanced]) {
        this.phase = payload.phase;
        this.shared.setCurrentPhase(payload.phase);
    }

    private onTurnStarted(payload: EventPayloads[GameEventType.TURN_STARTED]) {
        this.currentPlayerId        = payload.playerId;
        this.shared.currentPlayerId = payload.playerId;
        this.phase                  = GamePhase.PreRoll;
        this.shared.currentPhase    = GamePhase.PreRoll;
    }

    private onTurnEnded(_payload: EventPayloads[GameEventType.TurnEnded]) {
        // Server will fire TURN_STARTED for next player
        // Nothing to do locally
    }

    private onDiceRolled(payload: EventPayloads[GameEventType.DiceRolled]) {
        if (payload.total === 7) {
            this.phase               = GamePhase.RobberPlacement;
            this.shared.currentPhase = GamePhase.RobberPlacement;
        } else {
            this.phase               = GamePhase.PostRoll;
            this.shared.currentPhase = GamePhase.PostRoll;
        }
    }

    private onRobberPlaced(_payload: EventPayloads[GameEventType.RobberPlaced]) {
        // After robber is placed check if steal is needed
        // Server will tell us if there are players to steal from
        this.phase               = GamePhase.RobberSteal;
        this.shared.currentPhase = GamePhase.RobberSteal;
    }

    private onRobberStealComplete(_payload: EventPayloads[GameEventType.RobberStealComplete]) {
        this.phase               = GamePhase.PostRoll;
        this.shared.currentPhase = GamePhase.PostRoll;
    }

    private onSetupTurnCompleted(_payload: EventPayloads[GameEventType.SetupTurnCompleted]) {
        // Server determines next setup phase and fires TURN_STARTED or PHASE_ADVANCED
    }

    private onGameEnded(_payload: EventPayloads[GameEventType.GameEnded]) {
        this.phase               = GamePhase.End;
        this.shared.currentPhase = GamePhase.End;
    }

    // ─── Queries ──────────────────────────────────────────────────────

    public getCurrentPhase(): GamePhase {
        return this.phase;
    }

    public isPlayersTurn(playerId: string): boolean {
        return this.currentPlayerId === playerId;
    }

    // Build actions
    public isBuildingPhase(): boolean {
        return this.phase === GamePhase.PostRoll;
    }

    public isSetupPhase(): boolean {
        return this.phase === GamePhase.SetupPlaceSettlement
            || this.phase === GamePhase.SetupPlaceRoad;
    }

    // Dice
    public canRollDice(): boolean {
        return this.phase === GamePhase.PreRoll;
    }

    // Robber
    public mustPlaceRobber(): boolean {
        return this.phase === GamePhase.RobberPlacement;
    }

    public mustSteal(): boolean {
        return this.phase === GamePhase.RobberSteal;
    }

    // Trading — note: deliberately NOT phase-dependent
    // Anyone can respond to a trade offer regardless of phase
    // Only initiating a trade requires it to be your turn and post-roll
    public canInitiateTrade(playerId: string): boolean {
        return this.isPlayersTurn(playerId)
            && this.phase === GamePhase.PostRoll;
    }

    public canRespondToTrade(): boolean {
        // Always true — you can accept/reject offers at any time
        return true;
    }

    public isGameOver(): boolean {
        return this.phase === GamePhase.End;
    }
}