import {LayoutSettings} from "@/game/model/types.ts";

export interface Animation {
    update(deltaTimeMs: number): void;
    draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings): void;
    isFinished(): boolean;
}