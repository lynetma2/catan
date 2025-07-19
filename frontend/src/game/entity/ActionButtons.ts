import {GameEvent} from "@/game/GameEvent.ts";
import {
    CitySVGString,
    DevelopmentCardBackSVGString, FinishTurnSVGString,
    HandshakeSVGString,
    HouseSVGString,
    RoadSVGString, WaitingSVGString
} from "@/assets/assets.tsx";

export class ActionButton {

    public kind: string;
    public startX: number;
    public startY: number;
    public height: number;
    public width: number;
    public color: string;
    public canvas: HTMLCanvasElement;
    public isHovered: boolean;
    private iconHeight: number;
    private iconWidth: number;
    public static WAITINGSTATE = "WAITINGSTATE";
    public static FINISHTURN = "FINISHTURN";

    constructor(kind: string, startX: number, startY: number, width: number, height: number, canvas: HTMLCanvasElement, color: string) {
        this.kind = kind;
        this.startX = startX;
        this.startY = startY;
        this.height = height;
        this.width = width;
        this.canvas = canvas;
        this.color = color;
        this.iconHeight = height/2;
        this.iconWidth = width/2;
        this.isHovered = false;
    }

    //Is clearing itself before drawing.
    public draw() {
        const ctx = this.canvas.getContext('2d');
        const image = new Image();
        const color = "blue";

        if (!ctx) {
            console.error("Can't draw action button");
            return;
        }

        ctx.beginPath();
        ctx.clearRect(this.startX, this.startY, this.width, this.height);
        ctx.closePath();

        switch (this.kind) {
            case GameEvent.TRADE:
                image.src = HandshakeSVGString(this.iconWidth, this.iconHeight, color);
                break;
            case GameEvent.PUTCITY:
                image.src = CitySVGString(this.iconWidth, this.iconHeight, color);
                break;
            case GameEvent.PUTSETTLEMENT:
                image.src = HouseSVGString(this.iconWidth, this.iconHeight, color);
                break;
            case GameEvent.DRAWDEVELOPMENTCARD:
                image.src = DevelopmentCardBackSVGString(this.iconWidth, this.iconHeight, color);
                break;
            case GameEvent.PUTROAD:
                //TODO draw something for this.
                image.src = RoadSVGString(this.iconWidth, this.iconHeight, color);
                break;
            case ActionButton.WAITINGSTATE:
                image.src = WaitingSVGString(this.iconWidth, this.iconHeight, color);
                break;
            case ActionButton.FINISHTURN:
                image.src = FinishTurnSVGString(this.iconWidth, this.iconHeight, color);
                break;
        }


        ctx.fillStyle = "white";
        ctx.strokeStyle = color;
        ctx.lineWidth = this.isHovered ? 5 : 1;
        ctx.beginPath();
        ctx.fillRect(this.startX, this.startY, this.width, this.height);
        ctx.strokeRect(this.startX, this.startY, this.width, this.height);
        ctx.closePath();

        ctx.drawImage(image, this.startX + this.iconWidth / 2, this.startY + this.iconHeight / 2);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
    }

    public clickHandler(event: MouseEvent, callback:(kind: string) => void) {
        if (this.isHovered) {
            callback(this.kind);
            return;
        }

        const insideXAxis = event.x <= (this.startX + this.width) && event.x >= this.startX;
        const insideYAxis = event.y <= (this.startY + this.height) && event.y >= this.startY;
        //TODO add animation
        if (insideXAxis && insideYAxis) {
            //Handle the event in here
            callback(this.kind);
        }
    }

    public hoverHandler(mouse: {x:number, y:number}, callback:(kind: string) => void) {
        const insideXAxis = mouse.x <= (this.startX + this.width) && mouse.x >= this.startX;
        const insideYAxis = mouse.y <= (this.startY + this.height) && mouse.y >= this.startY;
        if (insideXAxis && insideYAxis) {
            //Handle the event in here
            if (!this.isHovered) {
                this.isHovered = true;
                this.draw();
                callback(this.kind);
            }
        } else {
            if (this.isHovered) {
                this.isHovered = false;
                this.draw();
            }
        }
    }

    public static testButtons(canvas: HTMLCanvasElement): ActionButton[] {
        let startX = 500;
        const startY = 900;
        const width = 80;
        const height = 80;
        const margin = 5;
        const kinds = [GameEvent.TRADE, GameEvent.PUTROAD, GameEvent.PUTSETTLEMENT, GameEvent.PUTCITY, GameEvent.DRAWDEVELOPMENTCARD, ActionButton.FINISHTURN];
        const actionButtons: ActionButton[] = [];
        for (let i = 0; i < 6; i++) {
            actionButtons.push(new ActionButton(kinds[i], startX, startY, width, height, canvas, "green"))
            startX = startX + width + margin;
        }

        return actionButtons;
    }
}