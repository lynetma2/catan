export interface Player {
    id: string;
    name: string;
    color: string;
    resources: Resource[];
    victoryPoints: number;
}

export enum ResourceType {
    Lumber = "lumber",
    Brick = "brick",
    Wool = "wool",
    Grain = "grain",
    Ore = "ore"
}

export interface Resource {
    resourceType: ResourceType,
    uid: string
}

export type ResourcesComputed = Record<ResourceType, number>;