import type {DicePanelState, DieState} from "@/game/hud/panels/dice/types.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import {type EventPayloads, GameEventSource, GameEventType} from "@/game/events/GameEventTypes.ts";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {containsPoint, type Rect} from "@/game/utils/Rect.ts";
import {resolveDicePanelLayout} from "@/game/hud/panels/dice/DicePanelLayout.ts";

export class DicePanel {
    private die1: DieState = { value: null };
    private die2: DieState = { value: null };
    private isHovered: boolean = false;

    constructor(
        private readonly bus:        EventBus,
        private readonly frameQueue: FrameQueue,
        private readonly shared:     SharedState,
        private readonly resolution: ResolutionManager,
    ) {
        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        this.bus.on(GameEventType.DICE_ROLLED,     e  => this.onDiceRolled(e.payload));
        this.bus.on(GameEventType.TURN_STARTED,    _e => this.reset());
        this.bus.on(GameEventType.GAME_STATE_LOADED,_e => this.reset());
    }

    private onDiceRolled(payload: EventPayloads[GameEventType.DICE_ROLLED]) {
        const valueDie1 = payload.values[0];
        const valueDie2 = payload.values[1];

        this.die1 = { value: valueDie1 };
        this.die2 = { value: valueDie2 };
    }

    private reset() {
        this.die1 = { value: null };
        this.die2 = { value: null };
    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type === InputType.MouseMove) {
            const layout     = resolveDicePanelLayout(this.resolution.get());
            this.isHovered   = containsPoint(layout.panel, event.screenPos);
            return this.isHovered;
        }

        if (event.type === InputType.MouseLeave) {
            this.isHovered = false;
            return false;
        }

        if (event.type !== InputType.MouseClick)  return false;
        if (!this.shared.canRollDice)             return false;
        if (!this.shared.isLocalPlayersTurn)      return false;

        const layout = resolveDicePanelLayout(this.resolution.get());
        if (!containsPoint(layout.panel, event.screenPos)) return false;

        this.frameQueue.push({
            type:    GameEventType.DICE_ROLL_REQUESTED,
            payload: {},
            source:  GameEventSource.Hud,
        });

        return true;
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): DicePanelState {
        return {
            die1:    this.die1,
            die2:    this.die2,
            isHovered: this.isHovered,
            canRoll: this.shared.canRollDice && this.shared.isLocalPlayersTurn,
            layout:  resolveDicePanelLayout(this.resolution.get()),
        };
    }
}