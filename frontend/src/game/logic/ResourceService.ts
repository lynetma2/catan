import type {GameState, Hex, Vertex} from "@/game/model/types.ts";
import {BuildingType, TileKind, VertexDirection, EventType} from "@/game/model/enums.ts";
import type {TransferResourcesEvent} from "@/game/model/events.ts";

export class ResourceService {
    
    public static calculateDistribution(game: GameState, roll: number): TransferResourcesEvent[] {
        const events: TransferResourcesEvent[] = [];
        
        // 1. Find triggering tiles
        const triggeringTiles = Array.from(game.board.tiles.values()).filter(tile => 
            tile.tileKind === TileKind.ResourceTile && 
            tile.dice === roll
        );

        for (const tile of triggeringTiles) {
            // 2. Check Robber
            if (game.board.robber.q === tile.hex.q && game.board.robber.r === tile.hex.r) {
                continue; // Robber blocks resources
            }

            // 3. Get adjacent vertices (Canonical)
            const vertices = this.getVerticesForHex(tile.hex);

            // 4. Check for buildings
            for (const vertex of vertices) {
                // Construct key (assuming standard key format used in BoardService/TestGame)
                // Format: q{q}r{r}d{Direction}
                const key = `q${vertex.q}r${vertex.r}d${vertex.direction}`;
                const building = game.board.buildings.get(key);

                if (building) {
                    const amount = building.type === BuildingType.City ? 2 : 1;
                    const resource = tile.resourceType;
                    
                    if (resource) {
                        events.push({
                            type: EventType.TransferResources,
                            playerId: "Server",
                            fromPlayerId: "Bank",
                            toPlayerId: building.playerName,
                            resources: { [resource]: amount }
                        });
                    }
                }
            }
        }

        return events;
    }

    /**
     * Returns the 6 canonical vertices for a given hex.
     * This maps the hex corners to the specific East/West vertices used in storage.
     */
    public static getVerticesForHex(hex: Hex): Vertex[] {
        const {q, r} = hex;
        return [
            { q, r, direction: VertexDirection.East },
            { q: q + 1, r: r - 1, direction: VertexDirection.West },
            { q: q - 1, r, direction: VertexDirection.East },
            { q, r, direction: VertexDirection.West },
            { q: q - 1, r: r + 1, direction: VertexDirection.East },
            { q: q + 1, r, direction: VertexDirection.West }
        ];
    }
}