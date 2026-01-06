import type {Building, LayoutSettings} from "@/game/model/types";
import {HexLayoutService} from "@/game/service/layout/hexLayoutService.ts";
import {BUILDING_STYLES, type BuildingStyle} from "@/game/theme/buildingStyles.ts";

export class BuildingRender {
    //Todo make these sizes based on the current layoutSettings instead.
    public static defaultBuildingHeight = 30;
    public static defaultBuildingWidth = 30;

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

        ctx.beginPath();
        ctx.drawImage(image,
            center.x - this.defaultBuildingWidth / 2,
            center.y - this.defaultBuildingHeight / 2,
            this.defaultBuildingWidth,
            this.defaultBuildingHeight
        );
        ctx.closePath();
    }
}