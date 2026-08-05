// hud/panels/dice/DicePanel.ts
import type {DicePanelState, DieState} from "@/game/hud/panels/dice/types.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {containsPoint} from "@/game/utils/Rect.ts";
import {resolveDicePanelLayout} from "@/game/hud/panels/dice/DicePanelLayout.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {GameServerEvents} from "@/events/game/GameServerEvents.ts";
import {GameActionEvents} from "@/events/game/GameActionEvents.ts";

export class DicePanel {
    private die1: DieState = { value: null };
    private die2: DieState = { value: null };
    private rollIsCurrent = false;
    private isHovered = false;

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
        this.bus.on(GameServerEvents.dice.roll.success, (payload) => this.onDiceRolled(payload.diceRoll));
        // Don't wipe the roll — demote it to "last roll" instead
        this.bus.on(GameServerEvents.turn.start.success, () => this.onTurnStarted());
        this.bus.on(GameServerEvents.state.full.success, (state) => {
            if (state.snapshot.diceRoll) {
                this.onDiceRolled(state.snapshot.diceRoll);
            }
        });
    }

    private onDiceRolled(diceRoll: { values: [number, number] }) {
        this.die1 = {value: diceRoll.values[0]};
        this.die2 = {value: diceRoll.values[1]};
        this.rollIsCurrent = true;
    }

    private onTurnStarted() {
        // Keep the previous roll visible, but mark it as stale
        this.rollIsCurrent = false;
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

    // ─── State ───────────────────────────────────────────────────────
    getState(): DicePanelState {
        return {
            die1: this.die1,
            die2: this.die2,
            isHovered: this.isHovered,
            canRoll: this.shared.canRollDice && this.shared.isLocalPlayersTurn,
            isMyTurn: this.shared.isLocalPlayersTurn,
            rollIsCurrent: this.rollIsCurrent,
            layout: resolveDicePanelLayout(this.resolution.get()),
        };
    }
}