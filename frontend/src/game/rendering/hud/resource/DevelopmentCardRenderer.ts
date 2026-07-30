// game/hud/panels/resource/DevelopmentCardRenderer.ts
import {type DevelopmentCard} from "@/game/hud/panels/resource/types";
import {type DevCardStyle, DEVELOPMENT_STYLES} from "@/game/rendering/theme/DevelopmentCardTheme.ts";

export class DevelopmentCardRenderer {
    private static imageCache: Map<string, HTMLImageElement> = new Map();

    constructor(private readonly ctx: CanvasRenderingContext2D) {
    }

    renderCards(cards: DevelopmentCard[]) {
        // Non-hovered first so hovered card renders on top
        cards.filter(c => !c.isHovered).forEach(c => this.drawCard(c));
        cards.filter(c => c.isHovered).forEach(c => this.drawCard(c));
    }

    private drawCard(card: DevelopmentCard) {
        const style = DEVELOPMENT_STYLES[card.developmentType];
        this.ctx.save();
        this.drawBackground(card, style);
        this.drawIcon(card, style);
        this.drawLabel(card);
        if (card.isSelected) this.drawSelectionGlow(card);
        this.ctx.restore();
    }

    private drawBackground(card: DevelopmentCard, style: DevCardStyle) {
        const {ctx} = this;
        const {x, y, width, height} = card.bounds;

        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 8);
        ctx.fillStyle = style.fillColor;
        ctx.fill();

        ctx.lineWidth = card.isSelected ? 2.5 : 1.5;
        ctx.strokeStyle = card.isSelected
            ? '#FFD700'
            : card.isHovered
                ? 'rgba(255,255,255,0.6)'
                : '#333333';
        ctx.stroke();
    }

    private drawIcon(card: DevelopmentCard, style: DevCardStyle) {
        const img = DevelopmentCardRenderer.getImage(style.imageSrc);
        if (!img.complete || img.naturalWidth === 0) return;

        const {x, y, width, height} = card.bounds;
        const padding = 5;
        const iconW = width - padding * 2;
        const iconY = y + (height - iconW) / 2;
        this.ctx.drawImage(img, x + padding, iconY, iconW, iconW);
    }

    private drawLabel(card: DevelopmentCard) {
        if (!card.isHovered) return;
        const {ctx} = this;
        const {x, y, width} = card.bounds;
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = 'rgba(128, 128, 128, 0.9)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        // friendly name
        const label = card.developmentType
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, c => c.toUpperCase());
        ctx.fillText(label, x + width / 2, y - 4);
    }

    private drawSelectionGlow(card: DevelopmentCard) {
        const {ctx} = this;
        const {x, y, width, height} = card.bounds;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 8);
        ctx.strokeStyle = 'transparent';
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    private static getImage(src: string): HTMLImageElement {
        if (!DevelopmentCardRenderer.imageCache.has(src)) {
            const img = new Image();
            img.src = src;
            DevelopmentCardRenderer.imageCache.set(src, img);
        }
        return DevelopmentCardRenderer.imageCache.get(src)!;
    }
}