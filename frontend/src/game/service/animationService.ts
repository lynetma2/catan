import type {Animation} from "@/game/model/animation.ts";
import type {LayoutSettings} from "@/game/model/types.ts";

export class AnimationService {
    private animations: Animation[] = [];
    private context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    public play(animation: Animation) {
        this.animations.push(animation);
    }

    public update(deltaTimeMs: number) {
        this.animations.forEach(anim => anim.update(deltaTimeMs));
        // Remove finished animations
        this.animations = this.animations.filter(anim => !anim.isFinished());
    }

    public draw(layoutSettings: LayoutSettings) {
        this.animations.forEach(anim => anim.draw(this.context, layoutSettings));
    }

    public clear() {
        this.animations = [];
    }
}