// dev/DebugEvents.ts
import { BuildRejectionReason, type EventPayloads, GameEventType } from '@/game/events/GameEventTypes';
import { BuildTargetKind, GamePhase, PieceType, ResourceType } from '@/game/core/types';

export type DebugEventTemplate = {
    [K in GameEventType]: {
        description: string;
        type:        K;
        payload:     () => EventPayloads[K];
    }
}[GameEventType];

export const DEBUG_EVENT_TEMPLATES: Record<string, DebugEventTemplate> = {

    // ─── Game State ───────────────────────────────────────────────────

    startGame: {
        description: 'Start game with empty players',
        type:        GameEventType.GAME_STARTED,
        payload:     () => ({ players: [] }),
    },
    endGame: {
        description: 'Trigger game end',
        type:        GameEventType.GAME_ENDED,
        payload:     () => ({}),
    },

    // ─── Dice ─────────────────────────────────────────────────────────

    rollSeven: {
        description: 'Roll a 7 — triggers robber',
        type:        GameEventType.DICE_ROLLED,
        payload:     () => ({ values: [3, 4], total: 7 }),
    },
    rollRandom: {
        description: 'Roll random dice',
        type:        GameEventType.DICE_ROLLED,
        payload:     () => {
            const die1  = Math.ceil(Math.random() * 6);
            const die2  = Math.ceil(Math.random() * 6);
            return { values: [die1, die2], total: die1 + die2 };
        },
    },
    rollSix: {
        description: 'Roll a 6',
        type:        GameEventType.DICE_ROLLED,
        payload:     () => ({ values: [3, 3], total: 6 }),
    },
    requestRoll: {
        description: 'Request dice roll',
        type:        GameEventType.DICE_ROLL_REQUESTED,
        payload:     () => ({}),
    },

    // ─── Turn ─────────────────────────────────────────────────────────

    nextTurn: {
        description: 'Advance to next player\'s turn',
        type:        GameEventType.TURN_STARTED,
        payload:     () => ({ playerId: 'p2' }),  // DebugTools will resolve dynamically
    },
    endTurn: {
        description: 'End current turn',
        type:        GameEventType.TURN_ENDED,
        payload:     () => ({ playerId: 'p1' }),
    },
    requestEndTurn: {
        description: 'Request end turn',
        type:        GameEventType.END_TURN_REQUESTED,
        payload:     () => ({}),
    },
    setupTurnDone: {
        description: 'Complete setup turn',
        type:        GameEventType.SETUP_TURN_COMPLETED,
        payload:     () => ({ playerId: 'p1' }),
    },

    // ─── Phase ────────────────────────────────────────────────────────

    preRoll: {
        description: 'Set phase to pre-roll',
        type:        GameEventType.PHASE_ADVANCED,
        payload:     () => ({ phase: GamePhase.PreRoll }),
    },
    postRoll: {
        description: 'Set phase to post-roll',
        type:        GameEventType.PHASE_ADVANCED,
        payload:     () => ({ phase: GamePhase.PostRoll }),
    },
    robberPlacement: {
        description: 'Trigger robber placement',
        type:        GameEventType.PHASE_ADVANCED,
        payload:     () => ({ phase: GamePhase.RobberPlacement }),
    },

    // ─── Player / Network ─────────────────────────────────────────────

    playerJoined: {
        description: 'Simulate player joining',
        type:        GameEventType.PLAYER_JOINED,
        payload:     () => ({ playerId: 'p3', name: 'Debug Player' }),
    },
    playerLeft: {
        description: 'Simulate player disconnect',
        type:        GameEventType.PLAYER_DISCONNECTED,
        payload:     () => ({ playerId: 'p2' }),
    },
    victoryPoints: {
        description: 'Set VP for p1',
        type:        GameEventType.VICTORY_POINTS_CHANGED,
        payload:     () => ({ playerId: 'p1', points: 5 }),
    },
    opponentCards: {
        description: 'Update opponent card count',
        type:        GameEventType.OPPONENT_CARD_COUNT_CHANGED,
        payload:     () => ({ playerId: 'p2', cardCount: 7 }),
    },
    longestRoad: {
        description: 'Award longest road to p1',
        type:        GameEventType.LONGEST_ROAD_CHANGED,
        payload:     () => ({ playerId: 'p1' }),
    },
    largestArmy: {
        description: 'Award largest army to p1',
        type:        GameEventType.LARGEST_ARMY_CHANGED,
        payload:     () => ({ playerId: 'p1' }),
    },
    requestDevCard: {
        description: 'Request draw dev card',
        type:        GameEventType.DRAW_DEVELOPMENT_CARD_REQUESTED,
        payload:     () => ({ playerId: 'p1' }),
    },

    // ─── Resources / Robber ───────────────────────────────────────────

    grantResources: {
        description: 'Grant 2 of each resource to local player',
        type:        GameEventType.RESOURCES_GRANTED,
        payload:     () => ({
            playerId:  'p1',
            resources: [
                { uid: crypto.randomUUID(), resourceType: ResourceType.Lumber },
                { uid: crypto.randomUUID(), resourceType: ResourceType.Lumber },
                { uid: crypto.randomUUID(), resourceType: ResourceType.Brick  },
                { uid: crypto.randomUUID(), resourceType: ResourceType.Brick  },
                { uid: crypto.randomUUID(), resourceType: ResourceType.Wool   },
                { uid: crypto.randomUUID(), resourceType: ResourceType.Grain  },
                { uid: crypto.randomUUID(), resourceType: ResourceType.Ore    },
            ],
        }),
    },
    spendResources: {
        description: 'Spend 2 resources (count only)',
        type:        GameEventType.RESOURCES_SPENT,
        payload:     () => ({ playerId: 'p1', amount: 2 }),
    },
    discardRequired: {
        description: 'Force local player to discard',
        type:        GameEventType.DISCARD_REQUIRED,
        payload:     () => ({ playerId: 'p1', amount: 4 }),
    },
    discardConfirmed: {
        description: 'Confirm discard (empty list)',
        type:        GameEventType.DISCARD_CONFIRMED,
        payload:     () => ({ playerId: 'p1', resources: [] }),
    },
    cardsDiscarded: {
        description: 'Cards discarded notification',
        type:        GameEventType.CARDS_DISCARDED,
        payload:     () => ({ playerId: 'p1', resources: [] }),
    },
    robberPlaced: {
        description: 'Place robber (mock hex)',
        type:        GameEventType.ROBBER_PLACED,
        payload:     () => ({ playerId: 'p1', hex: { q: 0, r: 0, s: 0 } }),
    },
    robberSteal: {
        description: 'Robber steal complete',
        type:        GameEventType.ROBBER_STEAL_COMPLETE,
        payload:     () => ({
            playerId: 'p1',
            resources: [{ uid: '1', resourceType: ResourceType.Ore }]
        }),
    },

    // ─── UI / HUD ─────────────────────────────────────────────────────

    toastSuccess: {
        description: 'Show success toast',
        type:        GameEventType.TOAST_REQUESTED,
        payload:     () => ({ message: 'Operation successful', kind: 'success' }),
    },
    toastError: {
        description: 'Show error toast',
        type:        GameEventType.TOAST_REQUESTED,
        payload:     () => ({ message: 'Something went wrong', kind: 'error' }),
    },
    openBuildPanel: {
        description: 'Open build panel',
        type:        GameEventType.PANEL_OPENED,
        payload:     () => ({ panel: 'build' }),
    },
    closeBuildPanel: {
        description: 'Close build panel',
        type:        GameEventType.PANEL_CLOSED,
        payload:     () => ({ panel: 'build' }),
    },

    // ─── Build Mode ───────────────────────────────────────────────────

    enterBuildRoad: {
        description: 'Enter build mode (Road)',
        type:        GameEventType.BUILD_MODE_ENTERED,
        payload:     () => ({ pieceType: PieceType.Road }),
    },
    exitBuildMode: {
        description: 'Exit build mode',
        type:        GameEventType.BUILD_MODE_EXITED,
        payload:     () => ({}),
    },

    buildRejected: {
        description: 'Simulate build rejection',
        type:        GameEventType.BUILD_REJECTED,
        payload:     () => ({
            pieceType: PieceType.Settlement,
            reason:    BuildRejectionReason.INSUFFICIENT_RESOURCES,
        }),
    },
    buildSent: {
        description: 'Simulate build sent to server (Mock)',
        type:        GameEventType.BUILD_SENT_TO_SERVER,
        payload:     () => ({
            pieceType: PieceType.Road,
            playerId: 'p1',
            target: { kind: BuildTargetKind.Edge, edge: { q: 0, r: 0, s: 0, dir: 0 } as any }
        }),
    },
    // Note: BUILD_PLACED and BUILD_PLACEMENT_REQUESTED usually require
    // valid geometry objects (Vertex/Edge) which are hard to mock here.
    buildPlacedMock: {
        description: 'Simulate build placed (Mock Geometry)',
        type:        GameEventType.BUILD_PLACED,
        payload:     () => ({
            pieceType: PieceType.Road,
            playerId: 'p1',
            target: { kind: BuildTargetKind.Edge, edge: { q: 0, r: 0, s: 0, dir: 0 } as any }
        }),
    },
};