import {TradeOfferResponseKind} from "@/game/hud/panels/tradeOffer/types.ts";

export interface PlayerResponseTheme {
    responseColors: Record<TradeOfferResponseKind, ResponseColors>;
    initialFont: string;
    ringWidth: number;
}

export interface ResponseColors {
    ring:        string;  // chip border
    dot:         string;  // status dot fill
    background:  string;  // chip fill
    initial:     string;  // letter color
}

export const defaultPlayerResponseTheme: PlayerResponseTheme = {
    responseColors: {
        [TradeOfferResponseKind.Accept]: {
            ring:       "#1D9E75",
            dot:        "#1D9E75",
            background: "#1a3d30",
            initial:    "#5DCAA5",
        },
        [TradeOfferResponseKind.Decline]: {
            ring:       "#E24B4A",
            dot:        "#E24B4A",
            background: "#3d1a1a",
            initial:    "#F09595",
        },
        [TradeOfferResponseKind.NoAnswer]: {
            ring:       "#5a4a30",
            dot:        "#5a4a30",
            background: "#2a2520",
            initial:    "#8a7a58",
        },
    },
    initialFont: "500 12px sans-serif",
    ringWidth:   2,
};