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
                return true;
            case EventType.EndTurn:
                return GameRuleService.canEndTurn(game, playerId);
            case EventType.MoveRobber:
            case EventType.StealResource:
                return true; // No resource cost for these, phase check is sufficient
            default:
                return true;
        }
    }

    public static getButtonStates(game: GameState, playerId: string): { type: ButtonType, isDisabled: boolean }[] {
        const actions = [
            { type: ButtonType.putRoad, event: EventType.BuildRoad },
            { type: ButtonType.putSettlement, event: EventType.BuildSettlement },
            { type: ButtonType.putCity, event: EventType.BuildCity },
            { type: ButtonType.drawDevelopmentCard, event: EventType.BuyDevelopmentCard },
            { type: ButtonType.endTurn, event: EventType.EndTurn }
        ];

        return actions.map(action => ({
            type: action.type,
            isDisabled: !this.canPerformAction(game, playerId, action.event)
        }));
    }
}