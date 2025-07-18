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
    public static WAITINGSTATE = "WAITINGSTATE";
    public static FINISHTURN = "FINISHTURN";

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
        const color = "blue";

        if (!ctx) {
            console.error("Can't draw action button");
            return;
        }

        switch (this.kind) {
            case GameEvent.TRADE:
                image.src = HandshakeSVGString(iconWidth, iconHeight, color);
                break;
            case GameEvent.PUTCITY:
                image.src = CitySVGString(iconWidth, iconHeight, color);
                break;
            case GameEvent.PUTSETTLEMENT:
                image.src = HouseSVGString(iconWidth, iconHeight, color);
                break;
            case GameEvent.DRAWDEVELOPMENTCARD:
                image.src = DevelopmentCardBackSVGString(iconWidth, iconHeight, color);
                break;
            case GameEvent.PUTROAD:
                //TODO draw something for this.
                image.src = RoadSVGString(iconWidth, iconHeight, color);
                break;
            case ActionButton.WAITINGSTATE:
                image.src = WaitingSVGString(iconWidth, iconHeight, color);
                break;
            case ActionButton.FINISHTURN:
                image.src = FinishTurnSVGString(iconWidth, iconHeight, color);
                break;
        }


        ctx.fillStyle = "white";
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.fillRect(x, y, buttonWidth, buttonHeight);
        ctx.strokeRect(x, y, buttonWidth, buttonHeight);
        ctx.closePath();

        ctx.drawImage(image, x + iconWidth / 2, y + iconHeight / 2);

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