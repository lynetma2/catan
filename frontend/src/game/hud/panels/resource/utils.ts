import {type ResourceCard} from "@/game/hud/panels/resource/types.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import {containsPoint, type Rect} from "@/game/utils/Rect.ts";

export function findHitCard(
    cards: ResourceCard[],
    pos: Vec2,
): ResourceCard | null {
    for (let i = cards.length - 1; i >= 0; i--) {
        if (containsPoint(cards[i].bounds, pos)) return cards[i];
    }
    return null;
}

export function findHitButton<TButtonType extends string>(
    buttons: Record<TButtonType, Rect>,
    pos: Vec2,
): TButtonType | null {
    for (const [type, rect] of Object.entries(buttons) as [TButtonType, Rect][]) {
        if (containsPoint(rect, pos)) return type;
    }
    return null;
}