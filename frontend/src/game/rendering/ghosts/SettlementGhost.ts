import type {GhostEffect, LayoutSettings, Vertex} from "@/game/model/types.ts";
import {BuildingRender} from "@/game/rendering/BuildingRender.ts";
import {BuildingType} from "@/game/model/enums.ts";

export type SettlementGhostVariant = 'indicator' | 'preview';

export class SettlementGhost implements GhostEffect {
    private readonly vertex: Vertex;
    private readonly color: string;
    private readonly variant: SettlementGhostVariant;

    constructor(vertex: Vertex, color: string = "rgba(255, 255, 255, 0.5)", variant: SettlementGhostVariant = 'indicator') {
        this.vertex = vertex;
        this.color = color;
        this.variant = variant;
    }

    draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings): void {
        if (this.variant === 'preview') {
            BuildingRender.drawGhostPreview(ctx, layoutSettings, this.vertex, this.color, BuildingType.Settlement);
        } else {
            BuildingRender.drawGhostIndicator(ctx, layoutSettings, this.vertex, this.color);
        }
    }
}