import {DEFAULT_DICE_STYLE, type DiceStyle} from "@/game/theme/diceStyles.ts";

export class DiceRender {
    
    public static draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, value: number, style: DiceStyle = DEFAULT_DICE_STYLE) {
        this.drawBackground(ctx, x, y, size, style);
        this.drawDots(ctx, x, y, size, value, style);
    }

    private static drawBackground(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, style: DiceStyle) {
        const radius = size * style.borderRadiusRatio;
        
        ctx.beginPath();
        ctx.fillStyle = style.backgroundColor;
        ctx.strokeStyle = style.borderColor;
        ctx.lineWidth = style.borderWidth;
        
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, size, size, radius);
        } else {
            // Fallback for older browsers
            ctx.rect(x, y, size, size);
        }
        
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    private static drawDots(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, value: number, style: DiceStyle) {
        ctx.fillStyle = style.dotColor;
        const dotRadius = size * style.dotSizeRatio;
        
        // Positions relative to size (0 to 1)
        const c = 0.5;
        const l = 0.25;
        const r = 0.75;

        const dots: {x: number, y: number}[] = [];

        if (value % 2 === 1) dots.push({x: c, y: c});
        if (value > 1) { dots.push({x: l, y: l}); dots.push({x: r, y: r}); }
        if (value > 3) { dots.push({x: r, y: l}); dots.push({x: l, y: r}); }
        if (value === 6) { dots.push({x: l, y: c}); dots.push({x: r, y: c}); }

        dots.forEach(dot => {
            ctx.beginPath();
            ctx.arc(x + dot.x * size, y + dot.y * size, dotRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        });
    }
}