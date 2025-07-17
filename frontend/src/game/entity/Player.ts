import type {Layout} from "@/game/hexagon/Layout.ts";

export class Player {
    public name: string;
    public resources: number[];
    public developmentCards: number[];
    public points: number;

    constructor(name: string, resources: number[], developmentCards: number[], points: number) {
        this.name = name;
        this.resources = resources;
        this.developmentCards = developmentCards;
        this.points = points;
    }

    public static fromJSON(json: any): Player {
        return new Player(json.name, json.resources, json.developmentCards, json.points);
    }

    public draw(canvas: HTMLCanvasElement, layout: Layout) {

        //draw predefined size (Fuck rescaling the window)


    }

}

export class PlayerResource {
    public resources: number[];

    constructor(resources: number[]) {
        this.resources = resources;
    }

    draw(canvas: HTMLCanvasElement) {

    }

    private drawResource(kind: number, canvas: HTMLCanvasElement, position: number) {

        const cardHeight = 80;
        const cardWidth = 40;

        switch (kind) {
            case 0: //Lumber
                break;
            case 1: //Brick
                break;
            case 2: //Grain
                break;
            case 3: //Wool
                break;
            case 4: //Ore
                break;
        }
    }
}
