export class LobbyEvent {

    public static SETREADY = "SETREADY";
    public static SETNOTREADY = "SETNOTREADY";
    public static STARTGAME = "STARTGAME";

    public kind: string;
    public player: string;

    constructor(kind: string, player: string) {
        this.kind = kind;
        this.player = player;
    }

}
