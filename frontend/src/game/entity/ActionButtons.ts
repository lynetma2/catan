
export class ActionButton {

    public kind: string;

    constructor(kind: string) {
        this.kind = kind;
    }

    public draw(canvas: HTMLCanvasElement, x: number) {
        const buttonHeight = 80;
        const buttonWidth = 80;
        const y = 900;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error("Can't draw action button");
            return;
        }

        ctx.fillStyle = "white";
        ctx.strokeStyle = "yellow";

        ctx.fillRect(x,y, buttonWidth, buttonHeight);
        ctx.strokeRect(x, y, buttonWidth, buttonHeight);

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