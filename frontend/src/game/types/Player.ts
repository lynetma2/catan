// types/Player.ts
export interface Player {
    id: string;
    name: string;
    color: string;
    resources: Resources;
    victoryPoints: number;
}

export interface Resources {
    wood:  number;
    brick: number;
    wool:  number;
    wheat: number;
    ore:   number;
}