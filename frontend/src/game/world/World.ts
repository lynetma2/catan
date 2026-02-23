// world/World.ts
import { type EventBus }             from '@/game/core/EventBus';
import { type FrameQueue }           from '@/game/core/FrameQueue';
import { type SharedState }          from '@/game/core/SharedState';
import { type Camera }               from '@/game/core/Camera';
import { type InputLayer }           from '@/game/core/Input/InputManager';
import { type NormalizedInputEvent } from '@/game/core/Input/InputEvent';
import { type WorldState }           from './types';
import { type EventPayloads }        from '@/game/events/GameEventTypes';
import { GameEventType,
    GameEventSource }           from '@/game/events/GameEventTypes';
import { type BuildContextFactory }  from '@/game/rules/BuildRules';
import { Board }                     from './board/Board';
import { BuildSystem }               from './systems/build/BuildSystem.ts';
import { HoverSystem }               from './systems/HoverSystem';
import { GamePhaseManager }          from '@/game/core/GamePhaseManager';

export class World implements InputLayer {
    readonly priority = 0;

    private readonly board:       Board;
    private readonly gamePhase:   GamePhaseManager;
    private readonly buildSystem: BuildSystem;
    private readonly hoverSystem: HoverSystem;

    private isPanning:  boolean                          = false;
    private lastPanPos: { x: number; y: number } | null = null;

    constructor(
        private readonly bus:        EventBus,
        private readonly frameQueue: FrameQueue,
        private readonly shared:     SharedState,
        private readonly camera:     Camera,
    ) {
        this.board      = new Board();
        this.gamePhase  = new GamePhaseManager(bus, shared);
        this.hoverSystem = new HoverSystem(this.board, camera);

        // World assembles the context factory — it is the only place
        // that knows about both Board and SharedState
        const buildContextFactory: BuildContextFactory = () => ({
            board: {
                isValidVertex:               v     => this.board.hexGrid.isValidVertex(v),
                isValidEdge:                 e     => this.board.hexGrid.isValidEdge(e),
                isVertexOccupied:            v     => this.board.placementMap.isVertexOccupied(v),
                isEdgeOccupied:              e     => this.board.placementMap.isEdgeOccupied(e),
                hasAdjacentRoad:             (v,p) => this.board.placementMap.hasAdjacentRoad(v, p),
                hasAdjacentRoadOrSettlement: (e,p) => this.board.placementMap.hasAdjacentRoadOrSettlement(e, p),
                respectsDistanceRule:        v     => this.board.placementMap.respectsDistanceRule(v),
                hasOwnSettlement:            (v,p) => this.board.placementMap.hasOwnSettlement(v, p),
            },
            player: {
                canAfford: (playerId, cost) => {
                    const resources = this.shared.players.get(playerId)?.resources ?? [];
                    return (Object.keys(cost) as (keyof typeof cost)[])
                        .every(type =>
                            resources
                                .filter(r => r.resourceType === type)
                                .length >= (cost[type] ?? 0)
                        );
                },
            },
            gamePhase: {
                isPlayersTurn:   id => this.gamePhase.isPlayersTurn(id),
                isBuildingPhase: ()  => this.gamePhase.isBuildingPhase(),
                isSetupPhase:    ()  => this.gamePhase.isSetupPhase(),
                canRollDice:     ()  => this.gamePhase.canRollDice(),
                mustPlaceRobber: ()  => this.gamePhase.mustPlaceRobber(),
            },
        });

        this.buildSystem = new BuildSystem(
            bus, frameQueue, shared, this.gamePhase, buildContextFactory
        );

        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        // World owns the board — it is responsible for mutating it
        this.bus.on(GameEventType.GameStateLoaded, e => this.onGameStateLoaded(e.payload));
        this.bus.on(GameEventType.BuildPlaced,     e => this.onBuildPlaced(e.payload));
    }

    private onGameStateLoaded(payload: EventPayloads[GameEventType.GameStateLoaded]) {
        this.board.loadFromSnapshot(payload.placements);
    }

    private onBuildPlaced(payload: EventPayloads[GameEventType.BuildPlaced]) {
        const { pieceType, target, playerId } = payload;

        switch (pieceType) {
            case 'settlement':
                if (target.kind === 'vertex')
                    this.board.placementMap.placeSettlement(target.vertex, playerId);
                break;
            case 'city':
                if (target.kind === 'vertex')
                    this.board.placementMap.placeCity(target.vertex, playerId);
                break;
            case 'road':
                if (target.kind === 'edge')
                    this.board.placementMap.placeRoad(target.edge, playerId);
                break;
        }
    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type === 'keydown') {
            return this.handleKeyDown(event.key);
        }

        if (event.type === 'mousedown' && this.isPanButton(event.button)) {
            this.isPanning  = true;
            this.lastPanPos = event.screenPos;
            return true;
        }

        if (event.type === 'mouseup') {
            this.isPanning  = false;
            this.lastPanPos = null;
            return false;
        }

        if (event.type === 'mousemove') {
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

        if (event.type === 'wheel') {
            this.camera.zoomAt(event.screenPos, event.delta > 0 ? 0.9 : 1.1);
            return true;
        }

        if (event.type === 'click') {
            return this.handleClick(event.screenPos);
        }

        return false;
    }

    private handleClick(screenPos: { x: number; y: number }): boolean {
        const target    = this.hoverSystem.getTarget();
        const buildMode = this.shared.buildMode;

        if (!target || !buildMode) return false;

        const validClick =
            (buildMode === 'settlement' && target.kind === 'vertex') ||
            (buildMode === 'city'       && target.kind === 'vertex') ||
            (buildMode === 'road'       && target.kind === 'edge');

        if (!validClick) return false;

        this.frameQueue.push({
            type:    GameEventType.BuildPlacementRequested,
            payload: { pieceType: buildMode, target },
            source:  GameEventSource.Input,
        });

        return true;
    }

    private handleKeyDown(key: string): boolean {
        if (key === 'Escape' && this.shared.buildMode) {
            this.frameQueue.push({
                type:    GameEventType.BuildModeExited,
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
            case 'road':       return 'edge';
            case 'settlement':
            case 'city':       return 'vertex';
            default:           return 'inspect';
        }
    }

    private isPanButton(button: string): boolean {
        return button === 'middle' || button === 'right';
    }
}