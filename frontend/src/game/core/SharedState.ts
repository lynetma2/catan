import {type Player, type Resource, ResourceType} from "@/game/core/types.ts";

export class SharedState {
    players: Map<string, Player> = new Map();
    localPlayerId: string | null = null;
    currentPlayerId: string | null = null;

    constructor() {
        this.localPlayerId = "player-1";
        this.currentPlayerId = "player-1";

        this.players = new Map();
        const testResources: Resource[] = [
            {
                resourceType: ResourceType.Lumber,
                uid: "resource-1"
            },
            {
                resourceType: ResourceType.Brick,
                uid: "resource-2"
            }
        ];
        const testPlayer: Player = {
            id: "player.1",
            name: "Test Player",
            color: "#000000",
            resources: testResources,
            victoryPoints: 0
        }
        this.players.set("player-1", testPlayer);
    }

    get localPlayer(): Player | null {
        if (!this.localPlayerId) return null;
        return this.players.get(this.localPlayerId) ?? null;
    }

    get localPlayerResources(): Resource[] | null {
        if (!this.localPlayer) return null;
        return this.localPlayer.resources;
    }

    get isLocalPlayersTurn(): boolean {
        return this.localPlayerId !== null
        && this.currentPlayerId === this.localPlayerId;
    }
}