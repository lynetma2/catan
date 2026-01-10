import type {Edge, Hex, Vertex} from "@/game/model/types.ts";

export class KeyService {
    //Used to translate coordinates into string keys.

    public static hexToKey(hex: Hex): string {
        return `q${hex.q}r${hex.r}`;
    }

    public static edgeToKey(edge: Edge): string {
        return `q${edge.q}r${edge.r}d${edge.direction}`;
    }

    public static vertexToKey(vertex: Vertex): string {
        return `q${vertex.q}r${vertex.r}d${vertex.direction}`;
    }
}