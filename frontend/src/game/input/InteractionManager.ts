import type {BaseEvent, Interactive} from "@/game/core/types.ts";

export class InteractionManager {
    private canvas: HTMLCanvasElement;
    private interactives: Interactive[] = [];
    private currentHover: Interactive | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.registerEvents();
    }

    register(interactive: Interactive) {
        this.interactives.push(interactive);
    }

    unregister(id: string) {
        this.interactives = this.interactives.filter(i => i.id !== id);
    }

    private registerEvents() {
        this.canvas.addEventListener("click", this.onClick);
        this.canvas.addEventListener("mousemove", this.onMouseMove);
    }

    private readonly onClick = (e: MouseEvent) => {
        const { x, y } = this.normalize(e);

        const target = this.findTarget(x, y);
        if (target?.onClick) {
            target.onClick({ x, y });
        }
    };

    private readonly onMouseMove = (e: MouseEvent) => {
        const { x, y } = this.normalize(e);
        const target = this.findTarget(x, y);

        if (target !== this.currentHover) {
            // Hover ended for previous target
            if (this.currentHover?.onHoverEnd) {
                this.currentHover.onHoverEnd({ x, y });
                //this.eventBus.emit("component:hover:end", { id: this.currentHover.id });
            }

            // Hover started for new target
            if (target?.onHoverStart) {
                target.onHoverStart({ x, y });
                //this.eventBus.emit("component:hover:start", { id: target.id, x, y });
            }

            this.currentHover = target;
        }

        // Still hovering (optional)
        if (target?.onHover) {
            target.onHover({ x, y });
            //this.eventBus.emit("component:hover", { id: target.id, x, y });
        }
    };

    private normalize(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    private findTarget(x: number, y: number): Interactive | null {
        // Simple bounding box test (replace with polygon math if needed)
        return (
            this.interactives.find(i =>
                x >= i.bounds.x &&
                x <= i.bounds.x + i.bounds.width &&
                y >= i.bounds.y &&
                y <= i.bounds.y + i.bounds.height
            ) || null
        );
    }
}
