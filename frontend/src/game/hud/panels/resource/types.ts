import type {Rect} from "@/game/utils/Rect.ts";
import type {ResourceType} from "@/game/core/types.ts";
import type {NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";

export interface ResourceCard {
    resourceType: ResourceType,
    uid: string,
    isHovered: boolean,
    isSelected: boolean,
    bounds: Rect;
}

export interface ResourcePanelState {
    bounds: Rect;
    resourceCards: ResourceCard[];
    mode: ResourcePanelModeState
}

export type AnyMode =
    | ResourcePanelMode<BrowseModeState>
    | ResourcePanelMode<DiscardModeState>
    | ResourcePanelMode<TradeModeState>

export type ResourcePanelModeState =
    | BrowseModeState
    | DiscardModeState
    | TradeModeState

export enum ResourcePanelModeKind {
    Browse = "Browse",
    Discard = "Discard",
    Trade = "Trade"
}

export interface ResourcePanelMode<TState extends ResourcePanelModeState> {
    handleInput(event: NormalizedInputEvent): boolean;
    getState(): TState;
    onEnter(): void;
    onExit(): void;
}

export interface BrowseModeState {
    kind:        ResourcePanelModeKind.Browse;
    canConfirm:  false;
    selectedIds: Set<string>;
    label:       null;
}

export interface DiscardModeState {
    kind:         ResourcePanelModeKind.Discard;
    canConfirm:   boolean;
    selectedIds:  Set<string>;
    label:        string;
    mustDiscard:  number;        // ← discard-specific
    discardedSoFar: number;      // ← discard-specific
}

export interface TradeModeState {
    kind:        ResourcePanelModeKind.Trade;
    canConfirm:  boolean;
    selectedIds: Set<string>;
    label:       string;
    offering:    string[];       // ← trade-specific
}