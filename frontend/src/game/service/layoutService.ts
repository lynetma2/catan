import type {Edge, Hex, LayoutSettings, Orientation, Point, Vertex} from "@/game/model/types.ts";
import {EdgeDirection, VertexDirection} from "@/game/model/enums.ts";

export class LayoutService {
    //Used to manipulate information about the hexagonal pattern used in the background layout.

    //Used to change the top layout of the hex pattern.
    public static pointy: Orientation = {
        f0: Math.sqrt(3.0),
        f1: Math.sqrt(3.0) / 2.0,
        f2: 0.0,
        f3: 3.0 / 2.0,
        b0: Math.sqrt(3.0) / 3.0,
        b1: -1.0 / 3.0,
        b2: 0.0,
        b3: 2.0 / 3.0,
        startAngle: 0.5
    }

    public static flat: Orientation = {
        f0: 3.0 / 2.0,
        f1: 0.0,
        f2: Math.sqrt(3.0) / 2.0,
        f3: Math.sqrt(3.0),
        b0: 2.0 / 3.0,
        b1: 0.0,
        b2: -1.0 / 3.0,
        b3: Math.sqrt(3.0) / 3.0,
        startAngle: 0.0
    }

    public static hexToPixel(layoutSettings: LayoutSettings, h: Hex): Point {
        const M: Orientation = layoutSettings.orientation;
        const size: Point = layoutSettings.size;
        const origin: Point = layoutSettings.origin;
        const x: number = (M.f0 * h.q + M.f1 * h.r) * size.x;
        const y: number = (M.f2 * h.q + M.f3 * h.r) * size.y;
        return {x: x + origin.x, y: y + origin.y};
    }

    public static pixelToHexFractional(layoutSettings: LayoutSettings, p: Point): Hex {
        const M: Orientation = layoutSettings.orientation;
        const size: Point = layoutSettings.size;
        const origin: Point = layoutSettings.origin;
        const pt: Point = {
            x: (p.x - origin.x) / size.x,
            y: (p.y - origin.y) / size.y
        }
        const q: number = M.b0 * pt.x + M.b1 * pt.y;
        const r: number = M.b2 * pt.x + M.b3 * pt.y;
        return {
            q: q,
            r: r,
        }
    }

    public static pixelToHexRounded(layoutSettings: LayoutSettings, p: Point): Hex {
        const h: Hex = LayoutService.pixelToHexFractional(layoutSettings, p);
        return {
            q: Math.round(h.q),
            r: Math.round(h.r),
        }
    }

    public static hexCornerOffset(layoutSettings: LayoutSettings, corner: number): Point {
        const M: Orientation = layoutSettings.orientation;
        const size: Point = layoutSettings.size;
        const angle: number = 2.0 * Math.PI * (M.startAngle - corner) / 6.0;
        return {
            x: size.x * Math.cos(angle),
            y: size.y * Math.sin(angle)
        }
    }

    public static hexPolygonCorners(layoutSettings: LayoutSettings, h: Hex): Point[] {
        const corners: Point[] = [];
        const center: Point = LayoutService.hexToPixel(layoutSettings, h);
        for (let i = 0; i < 6; i++) {
            const offset: Point = LayoutService.hexCornerOffset(layoutSettings, i);
            corners.push({
                x: center.x + offset.x,
                y: center.y + offset.y
            })
        }
        return corners;
    }

    public static edgePolygonCorners(layoutSettings: LayoutSettings, edge: Edge): Point[] {
        const corners: Point[] = [];
        const hexCorners = this.hexPolygonCorners(layoutSettings, edge);
        switch (edge.direction) {
            case EdgeDirection.North:
                corners.push(hexCorners[1], hexCorners[2]);
                break;
            case EdgeDirection.East:
                corners.push(hexCorners[0], hexCorners[1]);
                break;
            case EdgeDirection.West:
                corners.push(hexCorners[2], hexCorners[3]);
                break;
        }
        return corners;
    }

    public static vertexPolygonCorners(layoutSettings: LayoutSettings, vertex: Vertex): Point[] {
        const corners: Point[] = [];
        const center = this.hexToPixel(layoutSettings, vertex);
        let offset: Point;
        switch (vertex.direction) {
            case VertexDirection.East:
                offset = LayoutService.hexCornerOffset(layoutSettings, 0);
                break;
            case VertexDirection.West:
                offset = LayoutService.hexCornerOffset(layoutSettings, 3);
                break;
        }
        corners.push({x: center.x + offset.x, y: center.y + offset.y})
        return corners;
    }
}