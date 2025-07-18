import type {DevelopmentCard} from "@/game/entity/DevelopmentCard.ts";
import {
    BrickSVGString, DevelopmentCardBackSVGString, PathSVGString, QuestionMarkSVGString,
    RobberSVGString,
    SheepSVGString,
    StoneSVGString,
    WheatSVGString,
    WoodSVGString
} from "@/assets/assets.tsx";

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

    public drawPlayerStats(canvas: HTMLCanvasElement, y: number) {

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Can't draw player stats");
            return;
        }

        const statsHeight = 80;
        const statsWidth = 200;
        const x = 800;

        //Draw box
        ctx.beginPath();
        ctx.fillStyle = "#faf3e1";
        ctx.fillRect(x, y, statsWidth, statsHeight);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x, y, statsWidth, statsHeight);
        ctx.closePath();

        //TODO draw right hand stat show

        //Draw Circle with name and points
        const circleRadius = 30;
        const circleCenterX = x+5 + circleRadius;
        const circleCenterY = 5 + y + circleRadius;
        const startAngle = 0;
        const endAngle = 2 * Math.PI;
        ctx.beginPath();
        ctx.fillStyle = "lightblue"; //Should be player color
        ctx.arc(circleCenterX, circleCenterY, circleRadius, startAngle, endAngle, false);
        ctx.fill();
        ctx.closePath();

        //Name
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.fillText(this.name, circleCenterX - circleRadius + 10, circleCenterY - circleRadius + 10);
        ctx.closePath();

        //Points
        ctx.beginPath();
        ctx.fillText(this.points.toString(), circleCenterX, circleCenterY + circleRadius - 10);
        ctx.closePath();

        //Draw number of cards
        const cardWidth = 25;
        const cardHeight = 35;
        const cardMargin = 5;
        const iconWidth = 15;
        const iconHeight = 15;
        let currentX = x+2*circleRadius+cardMargin + 10;
        for (let i = 0; i < 4; i++) {
            const image = new Image();
            let text = ""
            switch (i) {
                case 0: //Resources
                    ctx.fillStyle = "lightblue";
                    ctx.strokeStyle = "transparent";
                    image.src = QuestionMarkSVGString(iconWidth, iconHeight, "black");
                    text = this.resources.sum.toString();
                    break;
                case 1: //Development
                    ctx.fillStyle = "white";
                    ctx.strokeStyle = "purple";
                    image.src = DevelopmentCardBackSVGString(iconWidth, iconHeight, "black");
                    text = this.developmentCards.length.toString();
                    break;
                case 2: //Knights
                    ctx.fillStyle = "white";
                    ctx.strokeStyle = "Black";
                    image.src = RobberSVGString(iconWidth, iconHeight, "black");
                    //TODO add this field;
                    text = "2"
                    break;
                case 3: //Longest Road
                    ctx.fillStyle = "white";
                    ctx.strokeStyle = "Black";
                    image.src = PathSVGString(iconWidth, iconHeight, "black");
                    //TODO add this
                    text = "3"
                    break;
            }

            ctx.beginPath();
            ctx.fillRect(currentX, y+10, cardWidth, cardHeight);
            ctx.strokeRect(currentX, y+10, cardWidth, cardHeight);
            ctx.closePath();

            ctx.drawImage(image, currentX + 5, y+15);

            //Number of
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.fillText(text, currentX + 8, y+55);
            ctx.closePath();

            currentX = currentX + cardWidth + cardMargin;
        }
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
        const image = new Image();
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Can\'t draw resource');
            return;
        }

        switch (kind) {
            case 0: //Lumber
                ctx.fillStyle = "darkgreen";
                image.src = WoodSVGString(20,20,"brown")
                break;
            case 1: //Brick
                ctx.fillStyle = "brown";
                image.src = BrickSVGString(20,20,"orange")
                break;
            case 2: //Grain
                ctx.fillStyle = "green";
                image.src = WheatSVGString(20,20,"yellow")
                break;
            case 3: //Wool
                ctx.fillStyle = "lightGreen";
                image.src = SheepSVGString(20,20, "black")
                break;
            case 4: //Ore
                ctx.fillStyle = "Gray";
                image.src = StoneSVGString(20,20, "darkGray")
                break;
        }

        ctx.beginPath();
        ctx.fillRect(xAxis, yAxis, cardWidth, cardHeight);
        ctx.closePath();
        ctx.drawImage(image, xAxis + 10, yAxis + 10);

        ctx.fillStyle = "white";
    }
}
