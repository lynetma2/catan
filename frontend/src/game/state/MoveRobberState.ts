import {BaseGameState} from "@/game/state/BaseGameState.ts";
import type {GameState, GhostEffect, Hex, LayoutSettings} from "@/game/model/types.ts";
import {HexLayoutService} from "@/game/layout/HexLayoutService.ts";
import {GameRuleService} from "@/game/logic/GameRuleService.ts";
import {EventType} from "@/game/model/enums.ts";
import type {MoveRobberEvent} from "@/game/model/events.ts";
import {RobberGhost} from "@/game/rendering/ghosts/RobberGhost.ts";
import {ActionValidator} from "@/game/logic/ActionValidator.ts";

export class MoveRobberState extends BaseGameState {
    private hoveredHex: Hex | undefined;
    private isValidHover: boolean = false;

    protected onMapMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        const hex = HexLayoutService.pixelToHexRounded(layoutSettings, {x, y});
        
        // Check if hex changed to avoid re-validation every frame
        if (!this.hoveredHex || hex.q !== this.hoveredHex.q || hex.r !== this.hoveredHex.r) {
            this.hoveredHex = hex;
            this.isValidHover = GameRuleService.canMoveRobber(game, hex);
        }
    }

    protected onMapClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        if (this.isValidHover && this.hoveredHex) {
            const localPlayer = game.players.find(p => p.isLocal);
            if (localPlayer) {
                if (!ActionValidator.canPerformAction(game, localPlayer.playerName, EventType.MoveRobber)) {
                    return;
                }

                const event: MoveRobberEvent = {
                    type: EventType.MoveRobber,
                    playerId: localPlayer.playerName,
                    hex: this.hoveredHex
                };
                this.context?.emitEvent(event);
                // We don't manually switch state here; we wait for the event to come back via the EventBus
                // which triggers StateTransitionService.
            }
        }
    }

    // Custom render to show the "Ghost" Robber
    getGhostEffects(): GhostEffect[] | undefined {
        if (this.hoveredHex && this.isValidHover) {
            return [new RobberGhost(this.hoveredHex)];
        }
        return undefined;
    }
}