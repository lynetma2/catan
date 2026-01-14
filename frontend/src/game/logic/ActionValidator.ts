import {ButtonType, EventType, GamePhase} from "@/game/model/enums.ts";
import type {GameState, PhaseConfig} from "@/game/model/types.ts";
import {GameRuleService} from "@/game/logic/GameRuleService.ts";

export class ActionValidator {
    public static isActionAllowed(phase: GamePhase, eventType: EventType, config: PhaseConfig): boolean {
        // If no config exists for this phase, block everything by default (safety)
        const allowed = config[phase];
        return allowed ? allowed.includes(eventType) : false;
    }

    /**
     * Comprehensive check: Is the action allowed by Phase AND Game Rules (Resources/Limits)?
     */
    public static canPerformAction(game: GameState, playerId: string, eventType: EventType): boolean {
        // 1. Phase Check
        if (!this.isActionAllowed(game.phase, eventType, game.phaseConfig)) {
            return false;
        }

        // 2. Rule/Resource Check
        switch (eventType) {
            case EventType.BuildRoad:
                return GameRuleService.canBuildRoad(game, playerId);
            case EventType.BuildSettlement:
                return GameRuleService.canBuildSettlement(game, playerId);
            case EventType.BuildCity:
                return GameRuleService.canBuildCity(game, playerId);
            case EventType.BuyDevelopmentCard:
                return GameRuleService.canBuyDevelopmentCard(game, playerId);
            case EventType.RollDice:
            case EventType.EndTurn:
            case EventType.MoveRobber:
            case EventType.StealResource:
                return true; // No resource cost for these, phase check is sufficient
            default:
                return true;
        }
    }

    public static getValidButtons(game: GameState, playerId: string): ButtonType[] {
        const buttons: ButtonType[] = [];
        if (this.canPerformAction(game, playerId, EventType.BuildRoad)) buttons.push(ButtonType.putRoad);
        if (this.canPerformAction(game, playerId, EventType.BuildSettlement)) buttons.push(ButtonType.putSettlement);
        if (this.canPerformAction(game, playerId, EventType.BuildCity)) buttons.push(ButtonType.putCity);
        if (this.canPerformAction(game, playerId, EventType.BuyDevelopmentCard)) buttons.push(ButtonType.drawDevelopmentCard);
        if (this.canPerformAction(game, playerId, EventType.EndTurn)) buttons.push(ButtonType.endTurn);
        return buttons;
    }
}