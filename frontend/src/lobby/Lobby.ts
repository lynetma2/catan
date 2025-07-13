
export class Lobby {
    public players: Map<string, Player>;

    constructor(players: Map<string, Player>) {
        this.players = players;
    }

    public static fromJSON(lobby: {players:{[key: string]: Player}}){
        return new Lobby(new Map(Object.entries(lobby.players)));
    }
}

export interface NewLobby {
    lobbyId: number;
}

export interface Player {
    username: string;
    isLeader: boolean;
    isReady: boolean;
}

export interface LobbyEvent {
    kind: "SETREADY" | "SETNOTREADY" | "STARTGAME";
    playerName: string;
}