import type {Rect} from "@/game/utils/Rect.ts";

export type OverviewStatKind = 'victoryPoints' | 'resources' | 'devCards' | 'knights' | 'road';

export interface HoveredStat {
    playerId: string;
    stat: OverviewStatKind;
}

export interface PlayerOverviewEntry {
    playerId:      string;
    name:          string;
    color:         string;
    victoryPoints: number;
    resCardCount: number;
    devCardCount:  number;
    hasLongestRoad: boolean;
    hasLargestArmy: boolean;
    usedRobbers: number;
    longestRoadLength: number;
    isCurrentTurn: boolean;
    isLocalPlayer: boolean;
    isAtDiscardRisk: boolean;
    discardStatus: 'none' | 'pending' | 'done';
}

export interface PlayerRowLayout {
    playerId: string;
    bounds:   Rect;
}

export interface PlayerOverviewState {
    bounds:  Rect;
    players: PlayerOverviewEntry[];
    rows:    PlayerRowLayout[];
    hoveredStat: HoveredStat | null;
}