type DevelopmentCardKind = "KNIGHT" | "POINT" | "MONOPOLY" | "YEAR_OF_THE_PLENTY" | "ROAD_BUILDING";

export class DevelopmentCard {

    public kind: DevelopmentCardKind;

    constructor(kind: DevelopmentCardKind) {
        this.kind = kind;
    }

    public draw(canvas: HTMLCanvasElement, position: number) {

        //TODO draw the card correctly.
        const cardHeight = 80;
        const cardWidth = 40;
        const cardMargin = 5;
        const xAxis = position * (cardWidth + cardMargin);
        const yAxis = 900;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Can\'t draw development card');
            return;
        }

        switch (this.kind) {
            case "KNIGHT":
                break;
            case "POINT":
                break;
            case "MONOPOLY":
                break;
            case "YEAR_OF_THE_PLENTY":
                break;
            case "ROAD_BUILDING":
                break;
        }

        ctx.fillStyle = "white";
        ctx.strokeStyle = "Purple";

        ctx.fillRect(xAxis, yAxis, cardWidth, cardHeight);
        ctx.rect(xAxis, yAxis, cardWidth, cardHeight);
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.strokeStyle = "White";
    }
}