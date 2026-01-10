import type {Board, Building, Edge, Hex, Player, Road, Vertex} from "@/game/model/types.ts";
import {BuildingType, EdgeDirection, VertexDirection} from "@/game/model/enums.ts";
import {Edge} from "@/game/model/edge.ts";

export class KeyService {
    //Used to translate coordinates into string keys.

    public static hexToKey(hex: Hex): string {
        return `q${hex.q}r${hex.r}`;
    }

    public static edgeToKey(edge: Edge): string {
        return `q${edge.q}r${edge.r}direction${edge.direction}`;
    }

    public static vertexToKey(vertex: Vertex): string {
        return `q${vertex.q}r${vertex.r}direction${vertex.direction}`;
    }
}