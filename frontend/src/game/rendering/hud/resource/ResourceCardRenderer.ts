import {type ResourceCard} from '@/game/hud/panels/resource/types.ts';
import {RESOURCE_STYLES, type ResourceStyle} from '@/game/rendering/theme/ResourceTheme.ts';

export class ResourceCardRenderer {
    private static imageCache: Map<string, HTMLImageElement> = new Map();

    constructor(private readonly ctx: CanvasRenderingContext2D) {}

    renderCards(cards: ResourceCard[]) {
        // Non-hovered first so hovered card renders on top
        cards.filter(c => !c.isHovered).forEach(c => this.drawCard(c));
        cards.filter(c =>  c.isHovered).forEach(c => this.drawCard(c));
    }

    // ─── Card drawing ─────────────────────────────────────────────────────────
    private drawCard(card: ResourceCard) {
        const style = RESOURCE_STYLES[card.resourceType];
        this.ctx.save();

        if (card.isDisabled) {
            this.ctx.globalAlpha = 0.35;
        }

        // 1. Apply shadow for the card body
        if (card.isHovered && !card.isDisabled) {
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            this.ctx.shadowBlur = 15;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 8;
        }

        this.drawBackground(card, style);

        // This prevents the icon and text from casting shadows onto the card itself
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        // 3. Draw inner elements cleanly
        this.drawIcon(card, style);
        this.drawLabel(card);
        if (card.isSelected) this.drawSelectionGlow(card);

        this.ctx.restore();
    }

    private drawBackground(card: ResourceCard, style: ResourceStyle) {
        const {ctx} = this;
        const {x, y, width, height} = card.bounds;

        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 8);
        ctx.fillStyle = style.fillColor;
        ctx.fill();

        ctx.lineWidth   = card.isSelected ? 2.5 : 1.5;
        ctx.strokeStyle = card.isSelected
            ? '#FFD700'
            : card.isHovered
                ? 'rgba(255,255,255,0.6)'
                : '#333333';
        ctx.stroke();
    }

    private drawIcon(card: ResourceCard, style: ResourceStyle) {
        const img = ResourceCardRenderer.getImage(style.imageSrc);
        if (!img.complete || img.naturalWidth === 0) return;

        const { x, y, width, height } = card.bounds;
        const padding = 5;
        const iconW = width - padding * 2;
        const iconY = y + (height - iconW) / 2;

        this.ctx.drawImage(img, x + padding, iconY, iconW, iconW);
    }

    private drawLabel(card: ResourceCard) {
        // Don't show label on disabled cards
        if (!card.isHovered || card.isDisabled) return;

        const {ctx} = this;
        const { x, y, width } = card.bounds;

        ctx.font         = 'bold 10px monospace';
        ctx.fillStyle = 'rgba(128, 128, 128, 0.9)';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'bottom';

        ctx.fillText(
            card.resourceType.charAt(0).toUpperCase() + card.resourceType.slice(1),
            x + width / 2,
            y - 4,
        );
    }

    private drawSelectionGlow(card: ResourceCard) {
        const { ctx }                 = this;
        const { x, y, width, height } = card.bounds;

        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur  = 10;

        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 8);
        ctx.strokeStyle = 'transparent';
        ctx.stroke();

        ctx.shadowBlur  = 0;
    }

    private static getImage(src: string): HTMLImageElement {
        if (!ResourceCardRenderer.imageCache.has(src)) {
            const img = new Image();
            img.src   = src;
            ResourceCardRenderer.imageCache.set(src, img);
        }
        return ResourceCardRenderer.imageCache.get(src)!;
    }
}