import type {GhostEffect, Hex, LayoutSettings} from "@/game/model/types.ts";
import {RobberRender} from "@/game/rendering/RobberRender.ts";

export class RobberGhost implements GhostEffect {
    private readonly hex: Hex;

    constructor(hex: Hex) {
        this.hex = hex;
    }

    draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings): void {
        ctx.globalAlpha = 0.5; // Ghostly transparency
        RobberRender.draw(ctx, layoutSettings, this.hex);
        ctx.globalAlpha = 1.0;
    }
}