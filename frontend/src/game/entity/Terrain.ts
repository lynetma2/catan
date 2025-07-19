import type {Hex} from "../hexagon/Hex.ts";
import type {Layout} from "@/game/hexagon/Layout.ts";
import {BrickSVGString, SheepSVGString, StoneSVGString, WheatSVGString, WoodSVGString} from "@/assets/assets.tsx";

export class Terrain {
    public hex: Hex;
    public kind: string;
    public dice?: number;
    public tradeKind?: string;
    public static LUMBER = "LUMBER";
    public static BRICK = "BRICK";
    public static GRAIN = "GRAIN";
    public static WOOL = "WOOL";
    public static ORE = "ORE";
    public static DESERT = "DESERT";
    public static SELECTED = "SELECTED";
    public static SEA = "SEA";

    constructor(hex: Hex, kind: string, dice?: number, tradeKind?: string) {
        this.hex = hex;
        this.kind = kind;
        this.dice = dice;
        this.tradeKind = tradeKind;
    }

    public draw(canvas: HTMLCanvasElement, layout: Layout): void {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Can't draw terrain");
            return;
        }

        const image = new Image();
        const iconHeight = layout.size.y/2 //Should be based on the layout thingy
        const iconWidth = layout.size.x/2
        let color = "";

        switch (this.kind) {
            case Terrain.LUMBER:
                color = "#129639"
                image.src = WoodSVGString(iconWidth, iconHeight, "brown");
                break;
            case Terrain.BRICK:
                color =  "#E06026"
                image.src = BrickSVGString(iconWidth, iconHeight, "brown");
                break;
            case Terrain.GRAIN:
                color = "#EFB516"
                image.src = WheatSVGString(iconWidth, iconHeight, "brown");
                break;
            case Terrain.WOOL:
                color = "#8EB50B"
                image.src = SheepSVGString(iconWidth, iconHeight, "brown");
                break;
            case Terrain.ORE:
                color = "#A2A8A4"
                image.src = StoneSVGString(iconWidth, iconHeight, "brown");
                break;
            case Terrain.DESERT:
                color = "#C8BF80"
                break;
            case Terrain.SELECTED:
                color = "#00F"
                break;
            case Terrain.SEA:
                color = "#00F"
                break;
        }

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.fill(this.hex.path2d(layout));
        ctx.closePath();

        //Draw image on top of it
        const center = this.hex.pixelCenter(layout);
        ctx.beginPath();
        ctx.drawImage(image, center.x - iconWidth/2, center.y - iconHeight/2 - 15);
        ctx.closePath();

        //Draw number in the bottom
        ctx.beginPath();
        ctx.fillStyle = "#FFF";
        ctx.font = "18px Verdana, Arial, sans-serif";
        ctx.fillText(this.dice ? this.dice.toString() : "Error", center.x - 10, center.y + iconHeight/2 + 15);
        ctx.closePath();

        ctx.font = "10px Verdana, Arial, sans-serif";

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
            case "SEA":
                return "blue"
            //TODO handle ports
            case "PORT":
                return "brown"
            default:
                return "#000"
        }
    }

    //TBD
}