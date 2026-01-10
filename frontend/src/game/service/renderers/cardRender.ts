import type {HandCard} from "@/game/model/types.ts";
import {RESOURCE_STYLES, type TileStyle} from "@/game/theme/tileStyles.ts";
import layoutConfigRaw from "@/game/config/hudLayout.json";

// Quick access to config for hover offset
const HAND_CONFIG = (layoutConfigRaw as any).containers.playerHand;

export class CardRender {
    private static imageCache: Map<string, HTMLImageElement> = new Map();

    private static getIcon(style: TileStyle): HTMLImageElement {
        const src = style.imageSrc;
        if (!this.imageCache.has(style.imageSrc)) {
            const img = new Image();
            img.src = style.imageSrc;
            this.imageCache.set(style.imageSrc, img);
        }
        return this.imageCache.get(src)!;
    }

    public static draw(ctx: CanvasRenderingContext2D, card: HandCard) {
        const style = RESOURCE_STYLES[card.resourceType];
        console.log("inside CardRender draw style: ", style);
        console.log("inside CardRender card: ", card);
        
        // 1. Calculate Visual Position (Pop-up effect)
        let drawY = card.layout.y;
        if (card.isHovered) {
            drawY -= HAND_CONFIG.hoverOffset;
        }

        const x = card.layout.x;
        const width = card.layout.width;
        const height = card.layout.height;

        // 2. Draw Card Background
        ctx.beginPath();
        // Use roundRect if available, otherwise rect
        if (ctx.roundRect) {
            ctx.roundRect(x, drawY, width, height, 8);
        } else {
            ctx.rect(x, drawY, width, height);
        }
        
        ctx.fillStyle = style.fillColor;
        ctx.fill();
        
        // Border
        ctx.lineWidth = 2;
        ctx.strokeStyle = card.isSelected ? "#FFD700" : "#333";
        ctx.stroke();
        ctx.closePath();

        // 3. Draw Icon
        const img = this.getIcon(style);
        if (img && img.complete && img.naturalWidth > 0) {
            // Draw icon centered in the card, slightly smaller
            const padding = 5;
            const iconW = width - (padding * 2);
            const iconH = iconW; // Keep aspect ratio square-ish for icon
            const iconY = drawY + (height - iconH) / 2;
            
            ctx.drawImage(img, x + padding, iconY, iconW, iconH);
        }
    }
}