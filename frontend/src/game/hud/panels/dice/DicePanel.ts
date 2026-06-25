import type { DicePanelState, DieState } from "@/game/hud/panels/dice/types.ts";
import type { EventBus } from "@/game/core/EventBus.ts";
import type { FrameQueue } from "@/game/core/FrameQueue.ts";
import type { SharedState } from "@/game/core/SharedState.ts";
import type { ResolutionManager } from "@/game/core/ResolutionManager.ts";
import { InputType, type NormalizedInputEvent } from "@/game/core/Input/InputEvent.ts";
import { containsPoint } from "@/game/utils/Rect.ts";
import { resolveDicePanelLayout } from "@/game/hud/panels/dice/DicePanelLayout.ts";
import type { GameEventMap } from "@/events/shared/AppEvents.ts";
import { GameServerEvents } from "@/events/game/GameServerEvents.ts";
import { GameActionEvents } from "@/events/game/GameActionEvents.ts";

export class DicePanel {
    private die1: DieState = { value: null };
    private die2: DieState = { value: null };
    private isHovered: boolean = false;

    constructor(
        private readonly bus: EventBus<GameEventMap>,
        private readonly frameQueue: FrameQueue<GameEventMap>,
        private readonly shared: SharedState,
        private readonly resolution: ResolutionManager,
    ) {
        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        this.bus.on(GameServerEvents.dice.roll.success, (payload) => this.onDiceRolled(payload));
        this.bus.on(GameServerEvents.turn.start.success, () => this.reset());
        this.bus.on(GameServerEvents.state.full.success, () => this.reset());
    }

    private onDiceRolled(payload: GameEventMap[typeof GameServerEvents.dice.roll.success]) {
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
            const layout = resolveDicePanelLayout(this.resolution.get());
            this.isHovered = containsPoint(layout.panel, event.screenPos);
            return this.isHovered;
        }

        if (event.type === InputType.MouseLeave) {
            this.isHovered = false;
            return false;
        }

        if (event.type !== InputType.MouseClick) return false;
        if (!this.shared.canRollDice) return false;
        if (!this.shared.isLocalPlayersTurn) return false;

        const layout = resolveDicePanelLayout(this.resolution.get());
        if (!containsPoint(layout.panel, event.screenPos)) return false;

        this.frameQueue.push({
            type: GameActionEvents.diceRoll,
            payload: {},
        });

        return true;
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): DicePanelState {
        return {
            die1: this.die1,
            die2: this.die2,
            isHovered: this.isHovered,
            canRoll: this.shared.canRollDice && this.shared.isLocalPlayersTurn,
            layout: resolveDicePanelLayout(this.resolution.get()),
        };
    }
}