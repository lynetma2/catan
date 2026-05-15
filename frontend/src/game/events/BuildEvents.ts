import type {BuildTarget, PieceType} from "@/game/core/types.ts";
import type {BuildRejectionReason} from "@/game/events/GameEventTypes.ts";

export const BuildEvents = {
    action: {
        place: 'action.build.place',
    },

    server: {
        placed: 'server.build.placed',
        rejected: 'server.build.rejected',
    },

    ui: {
        modeEntered: 'ui.build_mode.entered',
        modeExited: 'ui.build_mode.exited',
    },
} as const;

export interface BuildEventPayloads {
    [BuildEvents.action.place]: {
        pieceType: PieceType;
        target: BuildTarget;
    };

    [BuildEvents.server.placed]: {
        pieceType: PieceType;
        target: BuildTarget;
        playerId: string;
    };

    [BuildEvents.server.rejected]: {
        pieceType: PieceType;
        reason: BuildRejectionReason;
    };
}