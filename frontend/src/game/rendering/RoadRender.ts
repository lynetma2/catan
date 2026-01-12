import type {Edge, GameState, LayoutSettings, Road} from "@/game/model/types.ts";
import type {RoadStyle} from "@/game/theme/roadStyles.ts";
import {HexLayoutService} from "@/game/layout/HexLayoutService.ts";
import {PlayerService} from "@/game/logic/PlayerService.ts";

export class RoadRender {
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

    private static getStyle(road: Road, game: GameState): RoadStyle {
        //Somehow obtain information about the player color. TODO fix this.
        const playerStyle = PlayerService.getPlayerStyle(game, road.playerName);
        return {
            strokeStyle: playerStyle.strokeColor
        };
    }

    public static draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, road: Road, game: GameState) {
        ctx.beginPath();
        ctx.strokeStyle = this.getStyle(road, game).strokeStyle;
        ctx.lineWidth = layoutSettings.size.x * layoutSettings.ratios.roadWidth;
        ctx.stroke(this.edgeToPath(layoutSettings, road.edge));
        ctx.closePath();
    }

    public static drawGhostIndicator(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, edge: Edge, color: string) {
        const corners = HexLayoutService.edgePolygonCorners(layoutSettings, edge);
        // Calculate center of the edge (average of the two endpoints)
        const centerX = (corners[0].x + corners[1].x) / 2;
        const centerY = (corners[0].y + corners[1].y) / 2;
        const radius = layoutSettings.size.x * 0.15; // 15% of hex size

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    public static drawGhostPreview(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, edge: Edge, color: string) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = layoutSettings.size.x * layoutSettings.ratios.roadWidth;
        ctx.stroke(this.edgeToPath(layoutSettings, edge));
        ctx.closePath();
    }
}