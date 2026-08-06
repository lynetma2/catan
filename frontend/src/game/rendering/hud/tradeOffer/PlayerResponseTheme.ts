import {TradeOfferResponseKind} from "@/game/hud/panels/tradeOffer/types.ts";

export interface PlayerResponseTheme {
    responseColors: Record<TradeOfferResponseKind, ResponseColors>;
    initialFont: string;
    ringWidth: number;
}

/** Only the status dot is response-colored now;
 *  the chip body uses the player's own color. */
export interface ResponseColors {
    dot: string;
}

export const defaultPlayerResponseTheme: PlayerResponseTheme = {
    responseColors: {
        [TradeOfferResponseKind.Accept]: {
            dot: "#1D9E75",
        },
        [TradeOfferResponseKind.Decline]: {
            dot: "#E24B4A",
        },
        [TradeOfferResponseKind.NoAnswer]: {
            dot: "#5a4a30",
        },
    },
    initialFont: "700 14px sans-serif",
    ringWidth: 2,
};