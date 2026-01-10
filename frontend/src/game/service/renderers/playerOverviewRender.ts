import type {PlayerOverviewPanel} from "@/game/model/types.ts";

export class PlayerOverviewRender {

    public static draw(ctx: CanvasRenderingContext2D, panel: PlayerOverviewPanel) {
        this.drawBackground(ctx, panel);
        this.drawContent(ctx, panel);
    }

    private static drawBackground(ctx: CanvasRenderingContext2D, panel: PlayerOverviewPanel) {
        const { x, y, width, height } = panel.layout.container;
        const color = panel.player.style.fillColor;

        ctx.save();

        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, width, height, 10);
        } else {
            ctx.rect(x, y, width, height);
        }

        // 1. Solid Backing (Hides the world)
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "#222"; // Dark backing to ensure white text is readable
        ctx.fill();

        // 2. Player Color Tint
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = color;
        ctx.fill();

        // 2. Border (Opaque)
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.stroke();

        // 3. Active Turn Highlight
        if (panel.player.isActive) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#FFD700"; // Gold
            ctx.stroke();
        }

        ctx.restore();
    }

    private static drawContent(ctx: CanvasRenderingContext2D, panel: PlayerOverviewPanel) {
        const { x, y } = panel.layout.container;
        const { padding, fontSize, iconSize } = panel.layout.internal;
        const player = panel.player;

        ctx.save();
        ctx.fillStyle = "#FFF"; // Text Color
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textBaseline = "top";

        // 1. Player Name
        ctx.fillText(player.playerName, x + padding, y + padding);

        // 2. Stats Row (Calculated below name)
        const statsY = y + padding + fontSize + (padding / 2);
        
        // Calculate Total Cards
        const totalCards = Object.values(player.inventory.resources).reduce((a, b) => a + b, 0);

        // Helper to draw icon + text
        let currentX = x + padding;
        
        // Draw Points
        this.drawStat(ctx, currentX, statsY, iconSize, fontSize, "VP", player.points);
        currentX += iconSize * 3; // Spacing

        // Draw Cards
        this.drawStat(ctx, currentX, statsY, iconSize, fontSize, "Cards", totalCards);
        
        ctx.restore();
    }

    private static drawStat(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, fontSize: number, label: string, value: number) {
        // Placeholder Icon (Circle)
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
        ctx.fillStyle = "#CCC";
        ctx.fill();
        
        // Value
        ctx.fillStyle = "#FFF";
        ctx.font = `${fontSize}px Arial`;
        ctx.textBaseline = "middle";
        ctx.fillText(`${value}`, x + size + 5, y + size/2);
    }
}