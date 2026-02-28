import {Board} from "@/game/world/board/Board.ts";
import type {InputLayer} from "@/game/core/Input/types.ts";
import {GamePhaseManager} from "@/game/core/GamePhaseManager.ts";
import {BuildSystem} from "@/game/world/systems/build/BuildSystem.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import {type EventPayloads, GameEventSource, GameEventType} from "@/game/events/GameEventTypes.ts";
import {type BuildTarget, BuildTargetKind, PieceType} from "@/game/core/types.ts";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {type BuildValidator, createBuildValidator} from "@/game/world/systems/build/BuildValidator.ts";
import type {WorldState} from "@/game/world/types.ts";
import {HoverSystem} from "@/game/world/systems/hover/HoverSystem.ts";


export class World implements InputLayer {
    readonly priority = 0;

    private readonly board:       Board;
    private readonly gamePhase:   GamePhaseManager;
    private readonly buildSystem: BuildSystem;
    private readonly hoverSystem: HoverSystem;
    private readonly buildValidator: BuildValidator;

    private isPanning:  boolean                          = false;
    private lastPanPos: { x: number; y: number } | null = null;

    constructor(
        private readonly bus:        EventBus,
        private readonly frameQueue: FrameQueue,
        private readonly shared:     SharedState,
        private readonly camera:     Camera,
    ) {
        this.board = new Board();
        this.gamePhase = new GamePhaseManager(bus, shared);
        this.buildValidator = createBuildValidator(this.board, shared);
        this.buildSystem = new BuildSystem(bus, frameQueue, shared, this.gamePhase, this.buildValidator);
        this.hoverSystem = new HoverSystem(this.board, camera, this.buildValidator, shared);

        this.subscribeToEvents();
    }

        // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        // World owns the board — it is responsible for mutating it
        this.bus.on(GameEventType.GAME_STATE_LOADED, e =>
            this.onGameStateLoaded(e.payload));
        this.bus.on(GameEventType.BUILD_PLACED, e => this.onBuildPlaced(e.payload));
        this.bus.on(GameEventType.BUILD_MODE_ENTERED, _e => this.hoverSystem.onModeChanged());
        this.bus.on(GameEventType.BUILD_MODE_EXITED,  _e => {
            this.hoverSystem.onModeChanged();
            this.hoverSystem.clear();
        });
    }

    private onGameStateLoaded(payload: EventPayloads[GameEventType.GAME_STATE_LOADED]) {
        this.board.hexGrid.loadTiles(payload.tiles);
        this.board.loadFromSnapshot(payload.placements);
    }

    private onBuildPlaced(payload: EventPayloads[GameEventType.BUILD_PLACED]) {
        const { pieceType, target, playerId } = payload;

        switch (pieceType) {
            case PieceType.Settlement:
                if (target.kind === BuildTargetKind.Vertex)
                    this.board.placementMap.placeSettlement(target.vertex, playerId);
                break;
            case PieceType.City:
                if (target.kind === BuildTargetKind.Vertex)
                    this.board.placementMap.placeCity(target.vertex, playerId);
                break;
            case PieceType.Road:
                if (target.kind === BuildTargetKind.Edge)
                    this.board.placementMap.placeRoad(target.edge, playerId);
                break;
        }
    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type === InputType.KeyDown) {
            return this.handleKeyDown(event.key);
        }

        if (event.type === InputType.MouseDown && this.isPanButton(event.button)) {
            this.isPanning  = true;
            this.lastPanPos = event.screenPos;
            return true;
        }

        if (event.type === InputType.MouseUp) {
            this.isPanning  = false;
            this.lastPanPos = null;
            return false;
        }

        if (event.type === InputType.MouseMove) {
            if (this.isPanning && this.lastPanPos) {
                this.camera.panBy({
                    x: event.screenPos.x - this.lastPanPos.x,
                    y: event.screenPos.y - this.lastPanPos.y,
                });
                this.lastPanPos = event.screenPos;
                return true;
            }

            this.hoverSystem.update(event.screenPos, this.resolveHoverMode());
            return false;
        }

        if (event.type === InputType.Wheel) {
            this.camera.zoomAt(event.screenPos, event.delta > 0 ? 0.9 : 1.1);
            return true;
        }

        if (event.type === InputType.MouseClick) {
            return this.handleClick(event.screenPos);
        }

        if (event.type === InputType.MouseLeave) {
            this.hoverSystem.clear();
            return false;
        }

        return false;
    }

    private handleClick(screenPos: { x: number; y: number }): boolean {
        const target    = this.hoverSystem.getTarget();
        const buildMode = this.shared.buildMode;

        if (!target) return false;

        const pieceType = buildMode ?? this.inferPieceType(target);
        if (!pieceType) return false;

        this.frameQueue.push({
            type:    GameEventType.BUILD_PLACEMENT_REQUESTED,
            payload: { pieceType, target },
            source:  GameEventSource.Input,
        });

        return true;
    }

    private handleKeyDown(key: string): boolean {
        if (key === 'Escape' && this.shared.buildMode) {
            this.frameQueue.push({
                type:    GameEventType.BUILD_MODE_EXITED,
                payload: {},
                source:  GameEventSource.Input,
            });
            return true;
        }
        return false;
    }

    // ─── Update ───────────────────────────────────────────────────────

    update(_deltaTimeMs: number) {
        // Reserved for time-based world concerns
        // Systems react to events in their constructors
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): WorldState {
        return {
            hover:      this.hoverSystem.getState(),
            placements: this.board.placementMap.getState(),
            tiles:      this.board.hexGrid.getState(),
        };
    }

    // ─── Private helpers ──────────────────────────────────────────────

    private resolveHoverMode() {
        switch (this.shared.buildMode) {
            case PieceType.Road:       return BuildTargetKind.Edge;
            case PieceType.Settlement:
            case PieceType.City:       return BuildTargetKind.Vertex;
            default:           return 'inspect';
        }
    }

    private isPanButton(button: string): boolean {
        return button === 'middle' || button === 'right';
    }

    private inferPieceType(target: BuildTarget): PieceType | null {
        const playerId = this.shared.localPlayerId;
        switch (target.kind) {
            case BuildTargetKind.Vertex:
                // Prefer city upgrade if player has a settlement there
                if (playerId && this.buildValidator.canBuild(PieceType.City, target, playerId)) {
                    return PieceType.City;
                }
                return PieceType.Settlement;

            case BuildTargetKind.Edge:
                return PieceType.Road;

            default:
                return null;
        }
    }
}