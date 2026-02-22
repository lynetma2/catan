import type {Rect} from "@/game/utils/Rect.ts";

export interface PlayerOverviewEntry {
    playerId:      string;
    name:          string;
    color:         string;
    victoryPoints: number;
    cardCount:     number;
    devCardCount:  number;
    hasLongestRoad: boolean;
    hasLargestArmy: boolean;
    usedRobbers:   number;
    isCurrentTurn: boolean;
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