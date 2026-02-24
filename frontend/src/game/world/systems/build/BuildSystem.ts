import type {EventBus} from "@/game/core/EventBus.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import type {BuildValidator} from "@/game/world/systems/build/BuildValidator.ts";
import {type EventPayloads, GameEventSource, GameEventType} from "@/game/events/GameEventTypes.ts";
import type {PieceType} from "@/game/core/types.ts";
import {PIECE_COSTS} from "@/game/world/systems/build/BuildRules.ts";

export class BuildSystem {
    constructor(
        private readonly bus:           EventBus,
        private readonly frameQueue:    FrameQueue,
        private readonly shared:        SharedState,
        private readonly gamePhase:     GamePhaseManager,
        private readonly buildValidator: BuildValidator,
    ) {
        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        this.bus.on(GameEventType.BUILD_PLACEMENT_REQUESTED, e => this.onBuildRequested(e.payload));
    }

    // ─── Event handlers ───────────────────────────────────────────────

    private onBuildRequested(
        payload: EventPayloads[GameEventType.BUILD_PLACEMENT_REQUESTED]
    ) {
        const playerId = this.shared.localPlayerId;
        if (!playerId) return;

        const reason = this.buildValidator.validate(
            payload.pieceType,
            payload.target,
            playerId,
        );

        if (reason) {
            this.frameQueue.push({
                type:    GameEventType.BUILD_REJECTED,
                payload: { pieceType: payload.pieceType, reason },
                source:  GameEventSource.World,
            });
            return;
        }

        // Validation passed — fire placement and resource deduction atomically
        // TODO update this when connecting to the backend!
        this.frameQueue.push({
            type:    GameEventType.BUILD_PLACED,
            payload: {
                pieceType: payload.pieceType,
                target:    payload.target,
                playerId,
            },
            source: GameEventSource.World,
        });

        if (!this.gamePhase.isSetupPhase()) {
            this.frameQueue.push({
                type:    GameEventType.RESOURCES_SPENT,
                payload: {
                    playerId,
                    amount: this.totalCost(payload.pieceType),
                },
                source: GameEventSource.World,
            });
        }

        if (this.gamePhase.isSetupPhase()) {
            this.advanceSetupPhase();
        }
    }

    // ─── Setup phase ──────────────────────────────────────────────────
    // TODO handle phase advancements.
    private advanceSetupPhase() {
        switch (this.gamePhase.getCurrentPhase()) {
            case 'setup_place_settlement':
                this.frameQueue.push({
                    type:    GameEventType.PhaseAdvanced,
                    payload: { phase: 'setup_place_road' },
                    source:  GameEventSource.World,
                });
                break;

            case 'setup_place_road':
                this.frameQueue.push({
                    type:    GameEventType.SetupTurnCompleted,
                    payload: { playerId: this.shared.localPlayerId! },
                    source:  GameEventSource.World,
                });
                break;
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────

    private totalCost(pieceType: PieceType): number {
        return Object.values(PIECE_COSTS[pieceType])
            .reduce((sum, count) => sum + count, 0);
    }
}