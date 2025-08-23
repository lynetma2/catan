import type {Drawable, Interactive} from "@/game/core/types.ts";

export enum ButtonType {
    putRoad = "PutRoad",
    putHouse = "PutHouse",
    putCity = "PutCity",
    drawDevelopmentCard = "DrawDevelopmentCard",
    openTradeMenu = "OpenTradeMenu",
    endTurn = "EndTurn",
}

export interface Button extends Drawable, Interactive {
    type: ButtonType;
}