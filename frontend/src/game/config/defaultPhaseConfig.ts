import {EventType, GamePhase} from "@/game/model/enums.ts";
import type {PhaseConfig} from "@/game/model/types.ts";

export const DEFAULT_PHASE_CONFIG: PhaseConfig = {
    [GamePhase.SetupSettlement]: [EventType.BuildSettlement],
    [GamePhase.SetupRoad]: [EventType.BuildRoad],
    [GamePhase.FinishSetupBuild]: [EventType.EndTurn],
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