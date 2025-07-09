
export class Lobby {
    public players: Map<string, boolean>;

    constructor(players: Map<string, boolean>) {
        this.players = players;
    }
}