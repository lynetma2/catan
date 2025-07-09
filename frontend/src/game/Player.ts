export class Player {
    public name: string;
    public resources: number[];
    public developmentCards: number[];
    public points: number;

    constructor(name: string) {
        this.name = name;
        this.resources = [];
        this.developmentCards = [];
        this.points = 0;
    }

}
