import {Board} from "@/game/world/board/Board.ts";
import type {InputLayer} from "@/game/core/Input/types.ts";
import {GamePhaseManager} from "@/game/core/GamePhaseManager.ts";
import {BuildSystem} from "@/game/world/systems/build/BuildSystem.ts";
import type {Camera} from "@/game/core/Camera.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import type {EventBus} from "@/game/core/EventBus.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import {type BuildTarget, BuildTargetKind, type GameSnapshot, PieceType, GamePhase} from "@/game/core/types.ts";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {type BuildValidator, createBuildValidator} from "@/game/world/systems/build/BuildValidator.ts";
import type {WorldState} from "@/game/world/types.ts";
import {HoverSystem} from "@/game/world/systems/hover/HoverSystem.ts";

// New event imports
import {type GameServerEventMap, GameServerEvents} from "@/events/game/GameServerEvents";
import {GameUiEvents} from "@/events/game/GameUiEvents";
import {GameActionEventCreators} from "@/events/game/GameActionEvents";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";

export class World implements InputLayer {
    readonly priority = 0;

    private readonly board: Board;
    private readonly buildSystem: BuildSystem;
    private readonly hoverSystem: HoverSystem;
    private readonly buildValidator: BuildValidator;

    private isPanning: boolean = false;
    private lastPanPos: { x: number; y: number } | null = null;

    constructor(
        private readonly bus: EventBus<GameEventMap>,
        private readonly frameQueue: FrameQueue<GameEventMap>,
        private readonly shared: SharedState,
        private readonly camera: Camera,
        private readonly gamePhaseManager: GamePhaseManager,
    ) {
        this.board = new Board();
        this.buildValidator = createBuildValidator(this.board, shared);
        this.buildSystem = new BuildSystem(bus, frameQueue, shared, this.gamePhaseManager, this.buildValidator);
        this.hoverSystem = new HoverSystem(this.board, camera, this.buildValidator, shared);

        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        // World owns the board — it is responsible for mutating it
        this.bus.on(GameServerEvents.state.full.success, (payload) =>
            this.onGameStateLoaded(payload)
        );
        this.bus.on(
            GameServerEvents.build.settlement.success,
            payload => this.onSettlementBuilt(payload)
        );

        this.bus.on(
            GameServerEvents.build.city.success,
            payload => this.onCityBuilt(payload)
        );

        this.bus.on(
            GameServerEvents.build.road.success,
            payload => this.onRoadBuilt(payload)
        );
        this.bus.on(
            GameServerEvents.state.phase.change.success,
            () => {
                this.hoverSystem.onModeChanged();
                if (this.shared.currentPhase !== GamePhase.RobberPlacement) {
                    this.hoverSystem.clear();
                }
            }
        );
        this.bus.on(
            GameServerEvents.robber.placed.success,
            payload => this.onRobberPlaced(payload)
        );
        this.bus.on(GameUiEvents.build.enter, () => this.hoverSystem.onModeChanged());
        this.bus.on(GameUiEvents.build.exit, () => {
            this.hoverSystem.onModeChanged();
            this.hoverSystem.clear();
        });
    }

    private onGameStateLoaded(payload: {
        lobbyId: string;
        snapshot: GameSnapshot;
        localPlayerId: string;
    }) {
        const {snapshot} = payload;
        this.board.hexGrid.loadTiles(snapshot.tiles);
        this.board.loadFromSnapshot(snapshot.placements);
        this.hoverSystem.onModeChanged();
    }

    private onSettlementBuilt(
        payload: GameServerEventMap[typeof GameServerEvents.build.settlement.success]
    ) {
        this.board.placementMap.placeSettlement(
            payload.vertex,
            payload.playerId
        );
    }

    private onCityBuilt(
        payload: GameServerEventMap[typeof GameServerEvents.build.city.success]
    ) {
        this.board.placementMap.placeCity(
            payload.vertex,
            payload.playerId
        );
    }

    private onRoadBuilt(
        payload: GameServerEventMap[typeof GameServerEvents.build.road.success]
    ) {
        this.board.placementMap.placeRoad(
            payload.edge,
            payload.playerId
        );
    }

    private onRobberPlaced(
        payload: GameServerEventMap[typeof GameServerEvents.robber.placed.success]
    ) {
        this.board.hexGrid.moveRobber(payload.hex);
    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type === InputType.KeyDown) {
            return this.handleKeyDown(event.key);
        }

        if (event.type === InputType.MouseDown && this.isPanButton(event.button)) {
            this.isPanning = true;
            this.lastPanPos = event.screenPos;
            return true;
        }

        if (event.type === InputType.MouseUp) {
            this.isPanning = false;
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
        const target = this.hoverSystem.getTarget();
        const buildMode = this.shared.buildMode;

        if (!target) return false;

        const pieceType = buildMode ?? this.inferPieceType(target);
        if (!pieceType) return false;

        switch (pieceType) {
            case PieceType.City:
                if (target.kind === BuildTargetKind.Vertex) {
                    this.frameQueue.push(GameActionEventCreators.placeCity(target.vertex));
                }
                break;
            case PieceType.Road:
                if (target.kind === BuildTargetKind.Edge) {
                    this.frameQueue.push(GameActionEventCreators.placeRoad(target.edge));
                }
                break;
            case PieceType.Settlement:
                if (target.kind === BuildTargetKind.Vertex) {
                    this.frameQueue.push(GameActionEventCreators.placeSettlement(target.vertex));
                }
                break;
            case "robber":
                console.log("testing clicking on a hex, should send an event.!.!.!")
                if (target.kind === BuildTargetKind.Hex) {
                    this.frameQueue.push(GameActionEventCreators.placeRobber(target.hex))
                }
        }

        this.frameQueue.push({
            type: GameUiEvents.build.exit,
            payload: {},
        });

        return true;
    }

    private handleKeyDown(key: string): boolean {
        if (key === 'Escape' && this.shared.buildMode) {
            this.frameQueue.push({
                type: GameUiEvents.build.exit,
                payload: {},
            });
            return true;
        }
        return false;
    }

    // ─── Update ───────────────────────────────────────────────────────

    update(_deltaTimeMs: number) {
        // Reserved for time‑based world concerns
        // Systems react to events in their constructors
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): WorldState {
        return {
            hover: this.hoverSystem.getState(),
            placements: this.board.placementMap.getState(),
            tiles: this.board.hexGrid.getState(),
        };
    }

    // ─── Private helpers ──────────────────────────────────────────────

    private resolveHoverMode() {
        switch (this.shared.buildMode) {
            case PieceType.Road:
                return BuildTargetKind.Edge;
            case PieceType.Settlement:
            case PieceType.City:
                return BuildTargetKind.Vertex;
            case "robber":
                return "robber";
            default:
                return 'inspect';
        }
    }

    private isPanButton(button: string): boolean {
        return button === 'middle' || button === 'right';
    }

    private inferPieceType(target: BuildTarget): PieceType | null {
        const playerId = this.shared.localPlayerId;
        switch (target.kind) {
            case BuildTargetKind.Vertex:
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