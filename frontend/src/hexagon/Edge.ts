import type {Layout} from "./Layout.ts";

export class Edge {
    public q:number;
    public r:number;
    public s:number;
    public direction: string;
    public static NORTH_DIRECTION: string = "NORTH";
    public static EAST_DIRECTION: string = "EAST";
    public static WEST_DIRECTION: string = "WEST";

    constructor(q: number, r: number, s:number, direction: string) {
        this.q = q;
        this.r = r;
        this.s = s;
        this.direction = direction;
    }

    public path2d(layout: Layout): Path2D {
        const polygon = layout.edgeToPixelVertices(this);
        const edge = new Path2D();
        edge.moveTo(polygon[0].x, polygon[0].y);
        edge.lineTo(polygon[1].x, polygon[1].y);
        return edge
    }
}