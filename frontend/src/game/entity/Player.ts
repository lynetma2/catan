import type {Layout} from "@/game/hexagon/Layout.ts";
import type {DevelopmentCard} from "@/game/entity/DevelopmentCard.ts";

export class Player {
    public name: string;
    public resources: PlayerResource;
    public developmentCards: DevelopmentCard[];
    public points: number;

    constructor(name: string, resources: number[], developmentCards: DevelopmentCard[], points: number) {
        this.name = name;
        this.resources = new PlayerResource(resources);
        this.developmentCards = developmentCards;
        this.points = points;
    }

    public static fromJSON(json: any): Player {
        return new Player(json.name, json.resources, json.developmentCards, json.points);
    }

    public draw(canvas: HTMLCanvasElement) {

        //draw predefined size (Fuck rescaling the window)
        //TODO draw the rest cards etc.
        this.resources.draw(canvas);
        this.drawDevelopmentCards(canvas);

    }

    private drawDevelopmentCards(canvas: HTMLCanvasElement) {
        let position = this.resources.sum;
        this.developmentCards.forEach((card) => {
            card.draw(canvas, position);
            position++;
        });
    }

}

export class PlayerResource {
    public resources: number[];
    public sum: number;

    constructor(resources: number[]) {
        this.resources = resources;
        this.sum = this.resources.reduce((partialSum, a) => partialSum + a, 0);
    }

    public draw(canvas: HTMLCanvasElement) {
        let position = 0;
        this.resources.forEach((resource,i) => {
            for (let j = 0; j < resource; j++) {
                this.drawResource(i, canvas, position);
                position++;
            }
        });
    }

    private drawResource(kind: number, canvas: HTMLCanvasElement, position: number) {
        const cardHeight = 80;
        const cardWidth = 40;
        const cardMargin = 5;
        const xAxis = position * (cardWidth + cardMargin);
        const yAxis = 900;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Can\'t draw resource');
            return;
        }

        switch (kind) {
            case 0: //Lumber
                ctx.fillStyle = "brown";
                break;
            case 1: //Brick
                ctx.fillStyle = "brown";
                break;
            case 2: //Grain
                ctx.fillStyle = "Yellow";
                break;
            case 3: //Wool
                ctx.fillStyle = "Green";
                break;
            case 4: //Ore
                ctx.fillStyle = "Gray";
                break;
        }

        ctx.fillRect(xAxis, yAxis, cardWidth, cardHeight);

        ctx.fillStyle = "white";
    }
}
