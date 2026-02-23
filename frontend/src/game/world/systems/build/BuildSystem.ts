// world/systems/BuildSystem.ts
import { type EventBus }             from '@/game/core/EventBus.ts';
import { type FrameQueue }           from '@/game/core/FrameQueue.ts';
import { type SharedState }          from '@/game/core/SharedState.ts';
import { type GamePhaseManager }     from '@/game/core/GamePhaseManager';
import { type BuildContextFactory }  from '@/game/rules/BuildRules';
import { type EventPayloads }        from '@/game/events/GameEventTypes.ts';
import { GameEventType,
    GameEventSource }           from '@/game/events/GameEventTypes.ts';
import { PIECE_COSTS }               from '@/game/rules/BuildRules';
import type {PieceType} from "@/game/core/types.ts";
import {buildRules} from "@/game/world/systems/build/BuildRules.ts";

export class BuildSystem {
    constructor(
        private readonly bus:            EventBus,
        private readonly frameQueue:     FrameQueue,
        private readonly shared:         SharedState,
        private readonly gamePhase:      GamePhaseManager,
        private readonly buildContext:   BuildContextFactory,
    ) {
        this.subscribeToEvents();
    }

    // ─── Subscriptions ────────────────────────────────────────────────

    private subscribeToEvents() {
        this.bus.on(GameEventType.BuildPlacementRequested, e => this.onBuildRequested(e.payload));
    }

    // ─── Event handlers ───────────────────────────────────────────────

    private onBuildRequested(
        payload: EventPayloads[GameEventType.BuildPlacementRequested]
    ) {
        const playerId = this.shared.localPlayerId;
        if (!playerId) return;

        // Build context is created fresh — reads live state at validation time
        const reason = buildRules.validate(
            payload.pieceType,
            payload.target,
            playerId,
            this.buildContext()
        );

        if (reason) {
            this.frameQueue.push({
                type:    GameEventType.BuildRejected,
                payload: { pieceType: payload.pieceType, reason },
                source:  GameEventSource.World,
            });
            return;
        }

        // Validation passed — fire placement and resource deduction atomically
        // Both land in the same FrameQueue flush so state is always consistent
        this.frameQueue.push({
            type:    GameEventType.BuildPlaced,
            payload: {
                pieceType: payload.pieceType,
                target:    payload.target,
                playerId,
            },
            source: GameEventSource.World,
        });

        if (!this.gamePhase.isSetupPhase()) {
            this.frameQueue.push({
                type:    GameEventType.ResourcesSpent,
                payload: {
                    playerId,
                    amount: this.totalCost(payload.pieceType),
                },
                source: GameEventSource.World,
            });
        }

        // Advance setup phase after placement
        if (this.gamePhase.isSetupPhase()) {
            this.advanceSetupPhase();
        }
    }

    // ─── Setup phase ──────────────────────────────────────────────────

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