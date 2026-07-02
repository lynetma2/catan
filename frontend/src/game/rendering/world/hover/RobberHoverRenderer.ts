// rendering/world/hover/RobberHoverRenderer.ts
import type {Camera} from "@/game/core/Camera.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import type {RobberHoverState} from "@/game/world/systems/hover/RobberHoverSystem.ts";
import type {HoverTheme} from "@/game/rendering/world/WorldTheme.ts";

export class RobberHoverRenderer {
    constructor(
        private readonly ctx: CanvasRenderingContext2D,
        private readonly theme: HoverTheme,
        private readonly camera: Camera,
    ) {
    }

    render(state: RobberHoverState) {
        const {radius, hoverRadius, validFill, hoverFill, hoverStroke, strokeWidth} = this.theme.robber;

        // Dim ring on every valid hex
        for (const target of state.validTargets) {
            const center = this.camera.hexToWorld(target.hex);
            this.drawCircle(center, radius, validFill);
        }

        // Bright ring with stroke on the currently hovered hex
        if (state.target) {
            const center = this.camera.hexToWorld(state.target.hex);
            this.drawCircle(center, hoverRadius, hoverFill, hoverStroke, strokeWidth);
        }
    }

    // ─── Private ──────────────────────────────────────────────────────

    private drawCircle(center: Vec2, radius: number, fill: string, stroke?: string, lineWidth?: number) {
        const {ctx} = this;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = lineWidth ?? 2;
            ctx.stroke();
        }
    }
}