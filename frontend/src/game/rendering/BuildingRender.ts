import type {Building, LayoutSettings, Vertex} from "@/game/model/types.ts";
import {HexLayoutService} from "@/game/layout/HexLayoutService.ts";
import {BUILDING_STYLES, type BuildingStyle} from "@/game/theme/buildingStyles.ts";
import {BuildingType} from "@/game/model/enums.ts";

export class BuildingRender {
    private static imageCache: Map<string, HTMLImageElement> = new Map();

    private static getStyle(building: Building): BuildingStyle {
        //Somehow obtain information about the player color. TODO fix this.
        return BUILDING_STYLES[building.type];
    }

    private static getIcon(style: BuildingStyle) {
        const src = style.imageSrc;
        if (!this.imageCache.has(style.imageSrc)) {
            const img = new Image();
            img.src = style.imageSrc;
            this.imageCache.set(style.imageSrc, img);
        }
        return this.imageCache.get(src)!;
    }

    public static draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, building: Building) {
        const center = HexLayoutService.vertexPolygonCorners(layoutSettings, building.vertex)[0];
        const style = this.getStyle(building);
        const image = this.getIcon(style);

        if (!image.complete) return;

        let scale = layoutSettings.ratios.settlementScale;
        if (building.type === BuildingType.City) {
            scale = layoutSettings.ratios.cityScale;
        }

        const size = layoutSettings.size.x * scale;

        ctx.beginPath();
        ctx.drawImage(image,
            center.x - size / 2,
            center.y - size / 2,
            size,
            size
        );
        ctx.closePath();
    }

    public static drawGhostIndicator(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, vertex: Vertex, color: string) {
        const center = HexLayoutService.vertexPolygonCorners(layoutSettings, vertex)[0];
        const radius = layoutSettings.size.x * 0.15;

        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    public static drawGhostPreview(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, vertex: Vertex, color: string, type: BuildingType = BuildingType.Settlement) {
        const center = HexLayoutService.vertexPolygonCorners(layoutSettings, vertex)[0];
        // Use icon for preview
        const style = BUILDING_STYLES[type];
        const image = this.getIcon(style);

        if (!image.complete) return;

        let scale = layoutSettings.ratios.settlementScale;
        if (type === BuildingType.City) {
            scale = layoutSettings.ratios.cityScale;
        }
        const size = layoutSettings.size.x * scale;

        ctx.globalAlpha = 0.7;
        ctx.drawImage(image, center.x - size / 2, center.y - size / 2, size, size);
        ctx.globalAlpha = 1.0;
    }
}