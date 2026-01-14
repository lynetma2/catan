import {EventType, GamePhase} from "@/game/model/enums.ts";
import type {PhaseConfig} from "@/game/model/types.ts";

export const DEFAULT_PHASE_CONFIG: PhaseConfig = {
    [GamePhase.Setup_Settlement]: [EventType.BuildSettlement],
    [GamePhase.Setup_Road]: [EventType.BuildRoad],
    [GamePhase.PreRoll]: [EventType.RollDice, EventType.BuyDevelopmentCard], 
    [GamePhase.Main]: [
        EventType.BuildRoad, 
        EventType.BuildSettlement, 
        EventType.BuildCity, 
        EventType.BuyDevelopmentCard, 
        EventType.EndTurn
    ],
    [GamePhase.Discarding]: [EventType.DiscardResources],
    [GamePhase.RobberPlacement]: [EventType.MoveRobber],
    [GamePhase.Stealing]: [EventType.StealResource],
    [GamePhase.Waiting]: []
};