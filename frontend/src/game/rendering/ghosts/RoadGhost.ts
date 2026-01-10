import type {Edge, GhostEffect, LayoutSettings} from "@/game/model/types.ts";
import {RoadRender} from "@/game/rendering/RoadRender.ts";

export type RoadGhostVariant = 'indicator' | 'preview';

export class RoadGhost implements GhostEffect {
    private readonly edge: Edge;
    private readonly color: string;
    private readonly variant: RoadGhostVariant;

    constructor(edge: Edge, color: string = "rgba(255, 255, 255, 0.5)", variant: RoadGhostVariant = 'indicator') {
        this.edge = edge;
        this.color = color;
        this.variant = variant;
    }

    draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings): void {
        if (this.variant === 'preview') {
            RoadRender.drawGhostPreview(ctx, layoutSettings, this.edge, this.color);
        } else {
            RoadRender.drawGhostIndicator(ctx, layoutSettings, this.edge, this.color);
        }
    }
}