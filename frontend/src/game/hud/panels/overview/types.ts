import type {Rect} from "@/game/utils/Rect.ts";

export interface PlayerOverviewEntry {
    playerId:      string;
    name:          string;
    color:         string;
    victoryPoints: number;
    resCardCount: number;
    devCardCount:  number;
    hasLongestRoad: boolean;
    hasLargestArmy: boolean;
    usedRobbers:   number;
    isCurrentTurn: boolean;
    isLocalPlayer: boolean;
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
}