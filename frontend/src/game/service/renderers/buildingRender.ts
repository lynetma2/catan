import type {Building, LayoutSettings} from "@/game/model/types";
import {HexLayoutService} from "@/game/service/layout/hexLayoutService.ts";
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
}