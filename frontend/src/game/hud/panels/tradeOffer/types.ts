import type {Rect} from "@/game/utils/Rect.ts";

export interface TradeOfferBaseState {
    bounds: Rect;
}

export interface TradeOfferIncomingState extends TradeOfferBaseState {

}

export interface TradeOfferOutgoingState extends TradeOfferBaseState {

}