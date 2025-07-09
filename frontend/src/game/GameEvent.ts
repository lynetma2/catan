export class GameEvent {

    public static ROLLDICE = "ROLLDICE";
    public static PUTSETTLEMENT = "PUTSETTLEMENT";
    public static PUTROAD = "PUTROAD";
    public static PUTCITY = "PUTCITY";
    public static MOVEROBBER = "MOVEROBBER";
    public static USEDEVELOPMENTCARD = "USEDEVELOPMENTCARD";
    public static DRAWDEVELOPMENTCARD = "DRAWDEVELOPMENTCARD";
    public static TRADE = "TRADE";

    public kind: string;
    public player: number;
    public id: number;

    constructor(kind: string, player: number, id: number) {
        this.kind = kind;
        this.player = player;
        this.id = id;
    }

}
