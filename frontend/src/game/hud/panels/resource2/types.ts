import type {ResourceType} from "@/game/core/types.ts";

export enum TradeButtonType {
    Cancel = "Cancel",
    ConfirmGlobal = "ConfirmGlobal",
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
    | { kind: HitResultKind.Card, panelKind: TradePanelKind, uid: string, resourceType:  ResourceType}
    | { kind: HitResultKind.Button, button: TradeButtonType };