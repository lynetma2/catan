import type {Hex} from "@/game/utils/HexGeometry/Hex.ts";

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

export enum PieceType {
    Road = "road",
    Settlement = "settlement",
    City = "city"
}

export type BuildTarget =
    | { kind: 'vertex'; vertex: Vertex }
    | { kind: 'edge';   edge:   Edge   }
    | { kind: 'hex';    hex:    Hex    };
