// types/HudState.ts
import type {PlayerOverviewState} from "@/game/hud/panels/overview/types.ts";
import type {DicePanelState} from "@/game/hud/panels/dice/types.ts";
import type {BuildPanelState} from "@/game/hud/panels/build/types.ts";
import type {ResourcePanelManagerState} from "@/game/hud/panels/resource/types.ts";
import type {TradeOfferManagerState} from "@/game/hud/panels/tradeOffer/types.ts";

export interface HudState {
    toast:     Toast | null;
    panels: {
        resource: ResourcePanelManagerState;
        build:    BuildPanelState;
        overview: PlayerOverviewState;
        dice: DicePanelState;
        tradeOffers: TradeOfferManagerState;
    };
}

export interface Toast {
    message:     string;
    kind:        'error' | 'info' | 'success';
    remainingMs: number;
}

export enum ButtonType {
    drawDevelopmentCard = "DrawDevelopmentCard",
    putSettlement = "PutSettlement",
    putCity = "PutCity",
    putRoad = "PutRoad",
    endTurn = "EndTurn",
    waiting = "Waiting",
}

export enum Anchor {
    Top,
    Bottom,
    Left,
    Right,
    Center
}