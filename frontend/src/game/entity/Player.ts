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

}
