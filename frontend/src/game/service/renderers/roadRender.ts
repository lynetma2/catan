import type {Edge, LayoutSettings, Road} from "@/game/model/types";
import type {RoadStyle} from "@/game/theme/roadStyles.ts";
import {HexLayoutService} from "@/game/service/layout/hexLayoutService.ts";

export class RoadRender {
    //Used to translate coordinates into string keys.
    public static defaultRoadWidth = 1;

    private static edgeToPath(layoutSettings: LayoutSettings, edge: Edge): Path2D {
        const polygon = HexLayoutService.edgePolygonCorners(layoutSettings, edge);
        const path = new Path2D();
        path.moveTo(polygon[0].x, polygon[0].y);
        for (let i = 1; i < polygon.length; i++) {
            path.lineTo(polygon[i].x, polygon[i].y);
        }
        path.lineTo(polygon[0].x, polygon[0].y);
        path.closePath();
        return path;
    }

    private static getStyle(road: Road): RoadStyle {
        //Somehow obtain information about the player color. TODO fix this.
        return {
            fillColor: "#4895EF"
        }
    }

    public static draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, road: Road) {
        ctx.beginPath();
        ctx.fillStyle = this.getStyle(road).fillColor;
        ctx.lineWidth = this.defaultRoadWidth;
        ctx.stroke(this.edgeToPath(layoutSettings, road.edge));
        ctx.closePath();
    }
}