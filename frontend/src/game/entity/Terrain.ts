import type {Hex} from "../hexagon/Hex.ts";

export class Terrain {
    public hex: Hex;
    public kind: string;
    public dice?: number;
    public tradeKind?: string;

    constructor(hex: Hex, kind: string, dice?: number, tradeKind?: string) {
        this.hex = hex;
        this.kind = kind;
        this.dice = dice;
        this.tradeKind = tradeKind;
    }

    public styling() {
        switch (this.kind) {
            case "LUMBER":
                return "#129639"
            case "BRICK":
                return "#E06026"
            case "GRAIN":
                return "#EFB516"
            case "WOOL":
                return "#8EB50B"
            case "ORE":
                return "#A2A8A4"
            case "DESERT":
                return "#C8BF80"
            case "SELECTED":
                return "blue"
            default:
                return "#000"
        }
    }
    //TBD
}