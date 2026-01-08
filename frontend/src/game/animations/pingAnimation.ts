import type {Animation} from "@/game/model/animation.ts";
import type {LayoutSettings, Point} from "@/game/model/types.ts";

export class PingAnimation implements Animation {
    private readonly position: Point;
    private readonly color: string;
    private readonly duration: number = 1000; // 1 second
    private elapsed: number = 0;

    constructor(position: Point, color: string = "#FFD700") {
        this.position = position;
        this.color = color;
    }

    update(deltaTimeMs: number): void {
        this.elapsed += deltaTimeMs;
    }

    isFinished(): boolean {
        return this.elapsed >= this.duration;
    }

    draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings): void {
        const progress = this.elapsed / this.duration;
        
        // Ease-out effect: starts fast, slows down
        const t = 1 - Math.pow(1 - progress, 3);
        
        const maxRadius = layoutSettings.size.x; // Use hex size as reference
        const currentRadius = maxRadius * t;
        const alpha = 1 - t;

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = alpha;
        ctx.stroke();
        ctx.restore();
    }
}