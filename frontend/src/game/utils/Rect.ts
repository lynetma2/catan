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

export function unionRects(...rects: Rect[]): Rect {
    const minX = Math.min(...rects.map(r => r.x));
    const minY = Math.min(...rects.map(r => r.y));
    const maxX = Math.max(...rects.map(r => r.x + r.width));
    const maxY = Math.max(...rects.map(r => r.y + r.height));

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}