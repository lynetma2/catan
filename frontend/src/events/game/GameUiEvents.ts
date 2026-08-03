import {DOT_SEPARATOR, UI} from "@/events/shared/RootEventNamespaces.ts";
import type {EventUnion} from "@/events/shared/EventTypes.ts";
import {GAME_NAMESPACE} from "@/events/game/GameNamespace.ts";
import type {PieceType} from "@/game/core/types.ts";

export const GAME_UI = `${UI}${DOT_SEPARATOR}${GAME_NAMESPACE}${DOT_SEPARATOR}` as const;
export const BUILD_GAME_UI = `${GAME_UI}build` as const;
export const PANEL_GAME_UI = `${GAME_UI}panel` as const;
export const TRADE_GAME_UI = `${GAME_UI}trade` as const;
export const RESOURCE_SELECTION_GAME_UI = `${GAME_UI}resourceSelection` as const;

export const GameUiEvents = {
    state: `${GAME_UI}state`,
    toast: `${GAME_UI}toast`,
    panel: {
        open: `${PANEL_GAME_UI}open`,
        close: `${PANEL_GAME_UI}close`,
    },
    build: {
        enter: `${BUILD_GAME_UI}enter`,
        exit: `${BUILD_GAME_UI}exit`,
        place: `${BUILD_GAME_UI}place`,
    },
    trade: {
        start: `${TRADE_GAME_UI}start`,
        end: `${TRADE_GAME_UI}end`,
        cancel: `${TRADE_GAME_UI}cancel`,
    },
    resourceSelection: {
        start: `${RESOURCE_SELECTION_GAME_UI}start`,
        end: `${RESOURCE_SELECTION_GAME_UI}end`,
        cancel: `${RESOURCE_SELECTION_GAME_UI}cancel`,
    }
} as const;

// Flat event map – each leaf event name maps to its payload type
export interface GameUiEventMap {
    [GameUiEvents.state]: Record<never, never>;
    [GameUiEvents.toast]: { message: string, kind: 'error' | 'info' | 'success' };
    [GameUiEvents.panel.open]: { panel: 'trade' | 'build' | 'dev-cards'};
    [GameUiEvents.panel.close]: { panel: 'trade' | 'build' | 'dev-cards'};
    [GameUiEvents.build.enter]: { pieceType: PieceType};
    [GameUiEvents.build.exit]: Record<never, never>;
    [GameUiEvents.trade.start]: { initialSelection: string };
    [GameUiEvents.trade.end]: Record<never, never>;
    [GameUiEvents.trade.cancel]: Record<never, never>;
    [GameUiEvents.resourceSelection.start]: { requiredCount: number, usedCardId: string };
    [GameUiEvents.resourceSelection.end]: Record<never, never>;
    [GameUiEvents.resourceSelection.cancel]: Record<never, never>;
}

export type GameUiEvent = EventUnion<GameUiEventMap>;

export const GameUiEventCreators = {
    state() {
        return {
            type: GameUiEvents.state,
            payload: undefined,
        }
    },
    tradeStart(initialSelection: string) {
        return {
            type: GameUiEvents.trade.start,
            payload: {
                initialSelection: initialSelection
            },
        }
    },
    tradeCancel() {
        return {
            type: GameUiEvents.trade.cancel,
            payload: {},
        }
    },
    resourceSelectionStart(requiredCount: number, usedCardId: string) {
        return {
            type: GameUiEvents.resourceSelection.start,
            payload: {
                requiredCount: requiredCount,
                usedCardId: usedCardId
            }
        }
    },
    resourceSelectionCancel() {
        return {
            type: GameUiEvents.resourceSelection.cancel,
            payload: {}
        }
    }
} as const;