import {type Button, ButtonType} from "@/game/core/Buttons/ButtonType.ts";
import {PathSVGString} from "@/assets/assets.tsx";
import type {InteractionManager} from "@/game/input/InteractionManager.ts";
import {EventBus} from "@/game/core/EventBus.ts";
import type {GameEvents} from "@/game/core/types.ts";

export class PutRoadButton implements Button {
    type: ButtonType;
    bounds: { x: number; y: number; width: number; height: number };
    canvas: HTMLCanvasElement;
    color: string;
    id: string;
    private iconHeight: number;
    private iconWidth: number;
    private isHovered: boolean;
    private eventBus: EventBus<GameEvents>

    constructor(bounds: {
        x: number;
        y: number;
        width: number;
        height: number
    }, canvas: HTMLCanvasElement, color: string, id: string, manager: InteractionManager, eventBus: EventBus<GameEvents>) {
        this.type = ButtonType.putRoad;
        this.bounds = bounds;
        this.canvas = canvas;
        this.color = color;
        this.id = id;
        this.iconHeight = bounds.height / 2;
        this.iconWidth = bounds.width / 2;
        this.isHovered = false;
        this.eventBus = eventBus;
        manager.register(this);
    }

    onClick(event: { x: number; y: number }): void {
        //What happens when this is clicked?
        this.eventBus.publish('PressedButtonEvent', EventBus.createEvent({buttonType: ButtonType.putRoad}))
    }

    onHover(event: { x: number; y: number }): void {
        //What happens when this is hovered?

    }

    onHoverEnd(event: { x: number; y: number }): void {
        this.isHovered = false;
        this.draw();
        //Emit event
    }

    onHoverStart(event: { x: number; y: number }): void {
        this.isHovered = true;
        this.draw();
        //Emit event
    }

    draw() {
        const ctx = this.canvas.getContext('2d');
        const image = new Image();
        image.src = PathSVGString(this.iconWidth, this.iconHeight, this.color);

        if (!ctx) {
            console.error(`Can't draw the Button with id: ${this.id}`);
            return;
        }

        //The actual drawing process
        ctx.beginPath();
        ctx.clearRect(this.bounds.x - 5, this.bounds.y - 5, this.bounds.width + 10, this.bounds.height + 10);
        ctx.closePath();

        ctx.fillStyle = "white";
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.isHovered ? 4 : 1;
        ctx.beginPath();
        ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        ctx.closePath();

        ctx.drawImage(image, this.bounds.x + this.iconWidth / 2, this.bounds.y + this.iconHeight / 2);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
    }

}