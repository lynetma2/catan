import type { Rect }                   from "@/game/utils/Rect.ts";
import type { Resource, ResourceType } from "@/game/core/types.ts";
import type { NormalizedInputEvent }   from "@/game/core/Input/InputEvent.ts";

// ─── Hit testing ──────────────────────────────────────────────────────────────

export type PanelHit =
    | { kind: 'hand';               cardId: string }
    | { kind: 'offered';            cardId: string }
    | { kind: 'wanted';             cardId: string }
    | { kind: 'selector';           resourceType: ResourceType }
    | { kind: 'tradeCancel' }
    | { kind: 'tradeConfirmGlobal' }
    | { kind: 'tradeConfirmBank' }
    | { kind: 'none' }

export type TradeButtonKind =
    | 'tradeCancel'
    | 'tradeConfirmGlobal'
    | 'tradeConfirmBank'

// ─── Card ─────────────────────────────────────────────────────────────────────

export interface ResourceCard {
    resourceType: ResourceType;
    uid:          string;
    isHovered:    boolean;
    isSelected:   boolean;
    isDisabled:   boolean;
    bounds:       Rect;
}

// ─── Panel state ──────────────────────────────────────────────────────────────

export interface ResourcePanelState {
    bounds:        Rect;
    resourceCards: ResourceCard[];
    mode:          ResourcePanelModeState;
}

export type ResourcePanelModeState =
    | BrowseModeState
    | DiscardModeState
    | TradeModeState;

export enum ResourcePanelModeKind {
    Browse  = "Browse",
    Discard = "Discard",
    Trade   = "Trade",
}

// ─── Mode interface ───────────────────────────────────────────────────────────

export interface ResourcePanelMode<TState extends ResourcePanelModeState> {
    handleInput(event: NormalizedInputEvent): boolean;
    handleHit(hit: PanelHit): boolean;
    getState(): TState;
    /** IDs to exclude from the main hand while this mode is active. */
    getHandFilter(): Set<string>;
    /** Only implemented by TradeMode — wanted resources for hit-testing. */
    getWantedResources?(): Resource[];
    onEnter(): void;
    onExit(): void;
}

// ─── Mode states — logical only, no pixel data ───────────────────────────────

export interface BrowseModeState {
    kind:        ResourcePanelModeKind.Browse;
    canConfirm:  false;
    selectedIds: Set<string>;
    label:       null;
}

export interface DiscardModeState {
    kind:           ResourcePanelModeKind.Discard;
    canConfirm:     boolean;
    selectedIds:    Set<string>;
    label:          string;
    mustDiscard:    number;
    discardedSoFar: number;
}

export interface TradeModeState {
    kind:              ResourcePanelModeKind.Trade;
    selectedIds:       Set<string>;
    offeredResources:  Resource[];
    wantedTypes:       ResourceType[];
    canConfirmGlobal:  boolean;
    canConfirmBank:    boolean;
    // Hover state injected by ResourcePanel.getState(), not by TradeMode itself
    hoveredCardId?:     string | null;
    hoveredButton?:     TradeButtonKind | null;
}