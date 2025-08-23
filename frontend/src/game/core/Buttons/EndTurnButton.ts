import {type Button, ButtonType} from "@/game/core/Buttons/ButtonType.ts";
import {FinishTurnSVGString, WaitingSVGString} from "@/assets/assets.tsx";
import type {InteractionManager} from "@/game/input/InteractionManager.ts";

export class EndTurnButton implements Button {
    type: ButtonType;
    bounds: { x: number; y: number; width: number; height: number };
    canvas: HTMLCanvasElement;
    color: string;
    id: string;
    isWaiting: boolean;
    private iconHeight: number;
    private iconWidth: number;
    private isHovered: boolean;

    constructor(bounds: {
        x: number;
        y: number;
        width: number;
        height: number
    }, canvas: HTMLCanvasElement, color: string, id: string, manager: InteractionManager, isWaiting: boolean) {
        this.type = ButtonType.putRoad;
        this.bounds = bounds;
        this.canvas = canvas;
        this.color = color;
        this.id = id;
        this.iconHeight = bounds.height / 2;
        this.iconWidth = bounds.width / 2;
        this.isHovered = false;
        this.isWaiting = isWaiting;
        manager.register(this);
    }

    onClick(event: { x: number; y: number }): void {
        //What happens when this is clicked?

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
        image.src = this.isWaiting ? WaitingSVGString(this.iconWidth, this.iconHeight, this.color) : FinishTurnSVGString(this.iconWidth, this.iconHeight, this.color);

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