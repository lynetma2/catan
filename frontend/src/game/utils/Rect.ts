// types/Rect.ts
import type {Vec2} from "@/game/utils/Vec2.ts";

export interface Rect {
    x:      number;
    y:      number;
    width:  number;
    height: number;
}

export function containsPoint(rect: Rect, pos: Vec2): boolean {
    return pos.x >= rect.x
        && pos.x <= rect.x + rect.width
        && pos.y >= rect.y
        && pos.y <= rect.y + rect.height;
}