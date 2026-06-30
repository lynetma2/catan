// hud/panels/robberSteal/RobberStealPanel.ts
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {containsPoint} from "@/game/utils/Rect.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import {GameActionEvents} from "@/events/game/GameActionEvents.ts";
import type {RobberStealPanelState, StealTarget} from "@/game/hud/panels/robber/types.ts";

// ─── Layout constants ───────────────────────────────────────────────────
// Buttons stack vertically above the robber's hex, centered on the anchor x.
const TARGET_WIDTH = 120;
const TARGET_HEIGHT = 32;
const TARGET_GAP = 6;
const ANCHOR_OFFSET_Y = 48; // distance above the hex center, in screen px

export class RobberStealPanel {
    private hoveredPlayerId: string | null = null;

    constructor(
        private readonly bus: EventBus<GameEventMap>,
        private readonly frameQueue: FrameQueue<GameEventMap>,
        private readonly sharedState: SharedState,
        private readonly camera: Camera,
    ) {
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        // Server confirms the steal → nothing left to select, clear hover state
        // this.bus.on(GameServerEvents.robber.steal.success, () => {
        //     this.hoveredPlayerId = null;
        // });

        //TODO make sure the events are correct.
    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        const targets = this.computeTargets();
        if (!targets) return false;

        if (event.type === InputType.MouseMove) {
            const hit = targets.find(t => containsPoint(t.bounds, event.screenPos));
            this.hoveredPlayerId = hit?.playerId ?? null;
            return hit !== undefined;
        }

        if (event.type === InputType.MouseClick) {
            const hit = targets.find(t => containsPoint(t.bounds, event.screenPos));
            if (!hit) return false;

            this.frameQueue.push({
                type: GameActionEvents.robber.steal,
                payload: {targetPlayerId: hit.playerId},
            });
            return true;
        }

        if (event.type === InputType.MouseLeave) {
            this.hoveredPlayerId = null;
            return false;
        }

        return false;
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): RobberStealPanelState {
        const targets = this.computeTargets();
        if (!targets) {
            return {targets: null, anchor: null};
        }

        const anchor = this.resolveAnchor();
        return {targets, anchor};
    }

    /**
     * RobberStealPanelState has no single top-level `bounds` like BuildPanelState —
     * targets are a dynamic list, each with their own rect. HUD needs this to
     * bounds-test the panel as a whole, the same way it does for fixed panels.
     */
    isOverAnyTarget(screenPos: Vec2): boolean {
        const targets = this.computeTargets();
        if (!targets) return false;
        return targets.some(t => containsPoint(t.bounds, screenPos));
    }

    // ─── Private ──────────────────────────────────────────────────────

    /**
     * Returns null when there's nothing to show: not in steal phase,
     * no robber location yet, or no eligible candidates.
     * sharedState.stealCandidateIds is assumed pre-filtered by World —
     * local player already excluded, adjacency already resolved.
     */
    private computeTargets(): StealTarget[] | null {
        if (!this.sharedState.mustSteal) return null;
        if (this.sharedState.robberHex === null) return null;

        const candidateIds = this.sharedState.stealCandidateIds;
        if (candidateIds.length === 0) return null;

        const anchor = this.resolveAnchor();
        if (!anchor) return null;

        return candidateIds.map((playerId, index) =>
            this.layoutTarget(playerId, index, anchor)
        );
    }

    private layoutTarget(playerId: string, index: number, anchor: Vec2): StealTarget {
        const totalHeight = this.sharedState.stealCandidateIds.length * TARGET_HEIGHT
            + (this.sharedState.stealCandidateIds.length - 1) * TARGET_GAP;

        const x = anchor.x - TARGET_WIDTH / 2;
        const y = anchor.y - ANCHOR_OFFSET_Y - totalHeight
            + index * (TARGET_HEIGHT + TARGET_GAP);

        const player = this.sharedState.players.get(playerId);

        return {
            playerId,
            playerName: player?.name ?? "Unknown",
            playerColor: player?.color ?? "#888888",
            bounds: {x, y, width: TARGET_WIDTH, height: TARGET_HEIGHT},
            isHovered: this.hoveredPlayerId === playerId,
        };
    }

    private resolveAnchor(): Vec2 | null {
        const hex = this.sharedState.robberHex;
        if (!hex) return null;
        return this.camera.hexToScreen(hex);
    }
}