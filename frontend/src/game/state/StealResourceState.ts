import {BaseGameState} from "@/game/state/BaseGameState.ts";
import type {GameState, Hex, LayoutSettings} from "@/game/model/types.ts";
import {ResourceService} from "@/game/logic/ResourceService.ts";
import {EventType} from "@/game/model/enums.ts";
import type {StealResourceEvent} from "@/game/model/events.ts";
import {DefaultState} from "@/game/state/DefaultState.ts";
import {ActionValidator} from "@/game/logic/ActionValidator.ts";

export class StealResourceState extends BaseGameState {
    private readonly robberHex: Hex;
    private stealablePlayers: string[] = [];

    constructor(robberHex: Hex) {
        super();
        this.robberHex = robberHex;
    }

    onEnter(game: GameState, layoutSettings: LayoutSettings, context: any): void {
        super.onEnter(game, layoutSettings, context);
        this.identifyVictims(game);
        
        // If nobody to steal from, skip immediately
        if (this.stealablePlayers.length === 0) {
            console.log("No victims found, skipping steal phase.");
            // We need to defer this slightly or the state transition might conflict
            setTimeout(() => context.setGameState(new DefaultState()), 0);
        }
    }

    private identifyVictims(game: GameState) {
        const localPlayerId = game.players.find(p => p.isLocal)?.playerName;
        const vertices = ResourceService.getVerticesForHex(this.robberHex);
        const victims = new Set<string>();

        for (const vertex of vertices) {
            const key = `q${vertex.q}r${vertex.r}d${vertex.direction}`;
            const building = game.board.buildings.get(key);
            
            if (building && building.playerName !== localPlayerId) {
                // Check if they have resources
                const player = game.players.find(p => p.playerName === building.playerName);
                const totalResources = player ? Object.values(player.inventory.resources).reduce((a, b) => a + b, 0) + player.inventory.hiddenCount : 0;
                
                if (totalResources > 0) {
                    victims.add(building.playerName);
                }
            }
        }
        this.stealablePlayers = Array.from(victims);
    }

    // For now, we'll just use a simple UI overlay or console log. 
    // In a real implementation, you'd render a "Steal" button over the player's avatar/panel.
    // Here we will simulate clicking on the map (if we had player avatars on map) 
    // OR we assume the HUD handles the click. 
    // For this example, let's auto-steal if there is only 1 victim, or wait for HUD input.
    
    update(game: GameState, layoutSettings: LayoutSettings) {
        super.update(game, layoutSettings);
        
        // Auto-steal for simplicity if only 1 victim
        if (this.stealablePlayers.length === 1) {
            this.executeSteal(this.stealablePlayers[0]);
        }
    }

    public executeSteal(targetPlayerId: string) {
        const localPlayer = this.game?.players.find(p => p.isLocal);
        if (localPlayer) {
            if (!ActionValidator.canPerformAction(this.game!, localPlayer.playerName, EventType.StealResource)) {
                return;
            }

            const event: StealResourceEvent = {
                type: EventType.StealResource,
                playerId: localPlayer.playerName,
                targetPlayerId: targetPlayerId
            };
            this.context?.emitEvent(event);
            this.context?.setGameState(new DefaultState());
        }
    }
}