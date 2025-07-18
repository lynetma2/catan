import {GameEvent} from "@/game/GameEvent.ts";
import {CitySVGString, DevelopmentCardBackSVGString, HouseSVGString} from "@/assets/assets.tsx";

export class ActionButton {

    public kind: string;

    constructor(kind: string) {
        this.kind = kind;
    }

    public draw(canvas: HTMLCanvasElement, x: number) {
        const buttonHeight = 80;
        const buttonWidth = 80;
        const iconWidth = 40;
        const iconHeight = 40;
        const y = 900;
        const ctx = canvas.getContext('2d');
        const image = new Image();

        if (!ctx) {
            console.error("Can't draw action button");
            return;
        }

        switch (this.kind) {
            case GameEvent.TRADE:
                //TODO find icon for this.
                break;
            case GameEvent.PUTCITY:
                image.src = CitySVGString(iconWidth, iconHeight, "yellow");
                break;
            case GameEvent.PUTSETTLEMENT:
                image.src = HouseSVGString(iconWidth, iconHeight, "yellow");
                break;
            case GameEvent.DRAWDEVELOPMENTCARD:
                image.src = DevelopmentCardBackSVGString(iconWidth, iconHeight, "yellow");
                break;
            case GameEvent.PUTROAD:
                //TODO draw something for this.
                break;
        }


        ctx.fillStyle = "white";
        ctx.strokeStyle = "yellow";
        ctx.beginPath();
        ctx.fillRect(x,y, buttonWidth, buttonHeight);
        ctx.strokeRect(x, y, buttonWidth, buttonHeight);
        ctx.closePath();

        ctx.drawImage(image, x+iconWidth/2, y+iconHeight/2);

        ctx.strokeStyle = "white";
    }

    public static drawButtons(canvas: HTMLCanvasElement, actionButtons: ActionButton[]) {
        let x = 500;
        const margin = 5;
        const buttonWidth = 80;

        actionButtons.forEach((button, i) => {
            button.draw(canvas, x);
            x += buttonWidth + margin;
        })
    }
}