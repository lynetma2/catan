// world/systems/hover/RobberHoverSystem.ts
import {BuildTargetKind, GamePhase} from "@/game/core/types.ts";
import type {Board} from "@/game/world/board/Board.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import {hex, type Hex} from "@/game/utils/HexGeometry/Hex.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {GameServerEvents} from "@/events/game/GameServerEvents.ts";

export interface HexTarget {
    kind: BuildTargetKind.Hex;
    hex: Hex;
}

export interface RobberHoverState {
    target: HexTarget | null;
    validTargets: HexTarget[];
}

export class RobberHoverSystem {
    private target: HexTarget | null = null;
    private validTargets: HexTarget[] = [];
    private validSet: Set<string> = new Set();
    private lastScreenPos: Vec2 | null = null;

    constructor(
        private readonly board: Board,
        private readonly camera: Camera,
        private readonly shared: SharedState,
        bus: EventBus<GameEventMap>,
    ) {
        // Robber hover owns its phase subscription — no build.enter/exit concern here.
        // On phase change, SharedState is already updated, so mustPlaceRobber is current.
        bus.on(GameServerEvents.state.phase.change.success, (payload) => this.onPhaseChanged(payload.phase));
    }

    // ─── Phase change ─────────────────────────────────────────────────

    onPhaseChanged(newGamePhase: GamePhase) {
        console.log("RobberHoverSystem phase changed");
        if (newGamePhase === GamePhase.RobberPlacement && this.shared.isLocalPlayersTurn) {
            console.log("RobberHoverSystem entered Robber Mode");
            this.onEnterRobberMode();
        } else {
            console.log("RobberHoverSystem exited Robber Mode");
            this.clear();
        }
    }

    private onEnterRobberMode() {
        const validHexes = this.board.getValidRobberHexes();
        this.validTargets = validHexes.map(h => ({kind: BuildTargetKind.Hex as const, hex: h}));
        this.validSet = new Set(validHexes.map(h => hex.toKey(h)));

        if (this.lastScreenPos) {
            this.update(this.lastScreenPos);
        }
    }

    // ─── Per-mousemove update ─────────────────────────────────────────

    update(screenPos: Vec2) {
        this.lastScreenPos = screenPos;
        const candidate = this.screenToHexTarget(screenPos);
        this.target = (candidate && this.validSet.has(hex.toKey(candidate.hex)))
            ? candidate
            : null;
    }

    // ─── Queries ──────────────────────────────────────────────────────

    getTarget(): HexTarget | null {
        return this.target;
    }

    getState(): RobberHoverState {
        return {
            target: this.target,
            validTargets: this.validTargets,
        };
    }

    clearHover() {
        this.target = null;
        this.lastScreenPos = null;
    }

    clear() {
        this.validTargets = [];
        this.validSet.clear();
        this.clearHover();
    }

    // ─── Private ──────────────────────────────────────────────────────

    private screenToHexTarget(screenPos: Vec2): HexTarget | null {
        const h = this.camera.screenToHex(screenPos);
        return this.board.hexGrid.isValidHex(h)
            ? {kind: BuildTargetKind.Hex as const, hex: h}
            : null;
    }
}