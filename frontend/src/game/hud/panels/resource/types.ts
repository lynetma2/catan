import type {ResourceType} from "@/game/core/types.ts";
import type {Rect} from "@/game/utils/Rect.ts";
import type {NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";

export enum TradeButtonType {
    Cancel = "Cancel",
    ConfirmPublic = "ConfirmPublic",
    ConfirmBank = "ConfirmBank"
}

export enum HitResultKind {
    None = "None",
    Card = "Card",
    Button = "Button"
}

export enum TradePanelKind {
    Hand = "Hand",
    Offered = "Offered",
    Wanted = "Wanted",
    Selector = "Selector"
}

export type HitResult =
    | { kind: HitResultKind.None }
    | { kind: HitResultKind.Card, panelKind: TradePanelKind, uid: string, resourceType: ResourceType }
    | { kind: HitResultKind.Button, button: TradeButtonType };

export interface ResourceCard {
    resourceType: ResourceType;
    uid: string;
    isHovered: boolean;
    isSelected: boolean;
    isDisabled: boolean;
    bounds: Rect;
}

export interface BrowseModeState {
    kind: ResourcePanelModeKind.Browse;
    hand: { bounds: Rect, cards: ResourceCard[] };
    isAtDiscardRisk: boolean;
}

export enum DiscardButtonType {
    Confirm = "Confirm",
    Cancel = "Cancel",
}

export interface DiscardModeState {
    kind: ResourcePanelModeKind.Discard;
    hand: { bounds: Rect; cards: ResourceCard[] };
    amountSelected: number;
    discardCount: number;
    buttons: {
        confirm: Rect;
        cancel: Rect;
    };
    counter: Rect;
    hoveredButton: DiscardButtonType | null;
}

export interface TradeModeState {
    kind: ResourcePanelModeKind.Trade;
    [TradePanelKind.Hand]: { bounds: Rect; cards: ResourceCard[] };
    [TradePanelKind.Offered]: { bounds: Rect; cards: ResourceCard[] };
    [TradePanelKind.Wanted]: { bounds: Rect; cards: ResourceCard[] };
    [TradePanelKind.Selector]: { bounds: Rect; cards: ResourceCard[] };
    buttons: {
        cancel: Rect;
        confirmGlobal: Rect;
        confirmBank: Rect;
    };
    hoveredButton: TradeButtonType | null;
}

export type ResourcePanelModeState =
    | BrowseModeState
    | DiscardModeState
    | TradeModeState;

export interface ResourcePanelManagerState {
    modeState: ResourcePanelModeState;
    bounds: Rect;
}

export enum ResourcePanelModeKind {
    Browse = "Browse",
    Discard = "Discard",
    Trade = "Trade",
}

export interface ResourcePanelMode<
    TState extends ResourcePanelModeState,
    TEnterArg = void> {
    onEnter(arg: TEnterArg): void;

    onExit(): void;

    handleInput(event: NormalizedInputEvent): boolean;

    getState(): TState;
}