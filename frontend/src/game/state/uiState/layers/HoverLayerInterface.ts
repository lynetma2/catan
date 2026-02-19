import type {GhostEffect, Point} from "@/game/model/types.ts";

export interface HoverLayerInterface {
    layerType: string;
    current

    isActive(): boolean;
    detectAt(worldPos: Point): HoverResult | null;
    isValid(result: HoverResult): boolean;
    getGhostEffects(): GhostEffect[];
    onClick(worldPos: Point): void;
}

//TODO make a decision on HoverResult design.