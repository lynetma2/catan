import {Orientation} from "./Orientation.ts";
import {Point} from "./Point.ts";
import {Hex} from "./Hex.ts";
import {Edge} from "./Edge.ts";

export class Layout {

    public orientation: Orientation;
    public size: Point;
    public origin: Point;

    constructor(orientation: Orientation, size: Point, origin: Point, gap: number) {
        this.origin = origin;
        this.size = size;
        this.orientation = orientation;
    }

    public static pointy: Orientation = new Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);
    public static flat: Orientation = new Orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0);

    public hexToPixel(h: Hex): Point {
        const M: Orientation = this.orientation;
        const size: Point = this.size;
        const origin: Point = this.origin;
        const x: number = (M.f0 * h.q + M.f1 * h.r) * size.x;
        const y: number = (M.f2 * h.q + M.f3 * h.r) * size.y;
        return new Point(x + origin.x, y + origin.y);
    }

    public pixelToHexFractional(p: Point): Hex {
        const M: Orientation = this.orientation;
        const size: Point = this.size;
        const origin: Point = this.origin;
        const pt: Point = new Point((p.x - origin.x) / size.x, (p.y - origin.y) / size.y);
        const q: number = M.b0 * pt.x + M.b1 * pt.y;
        const r: number = M.b2 * pt.x + M.b3 * pt.y;
        return new Hex(q, r, -q - r);
    }

    public pixelToHexRounded(p: Point): Hex {
        return this.pixelToHexFractional(p).round();
    }

    public hexCornerOffset(corner: number): Point {
        const M: Orientation = this.orientation;
        const size: Point = this.size;
        const angle: number = 2.0 * Math.PI * (M.start_angle - corner) / 6.0;
        return new Point(size.x * Math.cos(angle), size.y * Math.sin(angle));
    }

    public polygonCorners(h: Hex): Point[] {
        const corners: Point[] = [];
        const center: Point = this.hexToPixel(h);
        for (let i = 0; i < 6; i++) {
            const offset: Point = this.hexCornerOffset(i);
            corners.push(new Point(center.x + offset.x, center.y + offset.y));
        }
        return corners;
    }

    public hexToPixelVertice(h: Hex) {
        const center = this.hexToPixel(h);
        const leftOffset = this.hexCornerOffset(0);
        const rightOffset = this.hexCornerOffset(3);
    }

    public edgeToPixelVertices(e: Edge) {
        const h = new Hex(e.q, e.r, e.s);
        const polygonCorners = this.polygonCorners(h);
        const vertices: Point[] = [];

        switch (e.direction) {
            case "NORTH":
                vertices.push(polygonCorners[4]);
                vertices.push(polygonCorners[5]);
                break;
            case "EAST":
                vertices.push(polygonCorners[5]);
                vertices.push(polygonCorners[0]);
                break;
            case "WEST":
                vertices.push(polygonCorners[3]);
                vertices.push(polygonCorners[4]);
                break;
        }

        return vertices;
    }

    public pixelToEdgeRounded(p: Point) {
        //Plan!
        const hexCenter = this.pixelToHexRounded(p);
        const polygonCorners = this.polygonCorners(hexCenter);
        let shortestsDistance: number | undefined = undefined;
        let shortestsCoordinates: Edge | undefined = undefined;
        for (let i = 0; i < 6; i++) {
            const a = polygonCorners[i];
            const b = polygonCorners[(i + 1) % 6];
            const d = (Math.abs((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x))
                / Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)));

            //Calculate hex coordinates of the current edge.
            let coordinates: Edge | undefined = undefined;
            switch (i) {
                case 0:
                    coordinates = new Edge(hexCenter.q + 1, hexCenter.r, hexCenter.s - 1, Edge.WEST_DIRECTION);
                    shortestsDistance = d;
                    shortestsCoordinates = coordinates;
                    break;
                case 1:
                    coordinates = new Edge(hexCenter.q, hexCenter.r + 1, hexCenter.s - 1, Edge.NORTH_DIRECTION);
                    break;
                case 2:
                    coordinates = new Edge(hexCenter.q - 1, hexCenter.r + 1, hexCenter.s, Edge.EAST_DIRECTION);
                    break;
                case 3:
                    coordinates = new Edge(hexCenter.q + 1, hexCenter.r, hexCenter.s - 1, Edge.WEST_DIRECTION);
                    break;
                case 4:
                    coordinates = new Edge(hexCenter.q + 1, hexCenter.r, hexCenter.s - 1, Edge.NORTH_DIRECTION);
                    break;
                case 5:
                    coordinates = new Edge(hexCenter.q + 1, hexCenter.r, hexCenter.s - 1, Edge.EAST_DIRECTION);
                    break;
            }

            if (shortestsDistance && shortestsDistance > d) {
                shortestsDistance = d;
                shortestsCoordinates = coordinates;
            }
        }
        //Udregn Hex fra denne position
        //Udregn edges i hex
        //Udregn afstand til edges
        //Returner den med kortest afstand, i hex coordinater.

        return shortestsCoordinates;
    }


}
