


type DevelopmentCardKind = "KNIGHT" | "POINT" | "MONOPOLY" | "YEAR_OF_THE_PLENTY" | "ROAD_BUILDING";

export class DevelopmentCard {

    public kind: DevelopmentCardKind;

    constructor(kind: DevelopmentCardKind) {
        this.kind = kind;
    }

    public draw(canvas: HTMLCanvasElement) {

        //TODO draw the card correctly.
    }
}