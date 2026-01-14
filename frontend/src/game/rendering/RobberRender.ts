import type {Hex, LayoutSettings} from "@/game/model/types.ts";
import { HexLayoutService } from "@/game/layout/HexLayoutService.ts";

export class RobberRender {
    /**
     * Draws the Robber (a dark pawn) at the specified hex coordinate.
     */
    public static draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, hex: Hex) {
        // Ensure your HexLayoutService has a hexToPixel method. 
        // If not, it is the center of the polygon corners for that hex.
        const center = HexLayoutService.hexToPixel(layoutSettings, hex);
        
        // Size calculations relative to the hex size
        const size = layoutSettings.size.x;
        const scale = 0.5; // Robber is 50% of the hex size
        const r = size * scale;

        ctx.save();
        ctx.translate(center.x, center.y);

        // 1. Drop Shadow (Semi-transparent oval)
        ctx.beginPath();
        ctx.ellipse(0, r * 0.45, r * 0.4, r * 0.15, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fill();

        // Set styles for the Robber body
        ctx.fillStyle = "#333333"; // Dark Grey
        ctx.strokeStyle = "#1a1a1a"; // Almost Black border
        ctx.lineWidth = 2;

        // 2. Body (Conical/Trapezoid shape)
        ctx.beginPath();
        ctx.moveTo(-r * 0.3, r * 0.4); // Bottom Left
        ctx.quadraticCurveTo(0, -r * 0.5, r * 0.3, r * 0.4); // Curve up to neck and down to Bottom Right
        ctx.lineTo(-r * 0.3, r * 0.4); // Close bottom
        ctx.fill();
        ctx.stroke();

        // 3. Head (Circle)
        ctx.beginPath();
        ctx.arc(0, -r * 0.35, r * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}