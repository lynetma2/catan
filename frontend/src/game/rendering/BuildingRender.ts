import type {Building, GameState, LayoutSettings, Vertex} from "@/game/model/types.ts";
import {HexLayoutService} from "@/game/layout/HexLayoutService.ts";
import {BUILDING_STYLES, type BuildingStyle} from "@/game/theme/buildingStyles.ts";
import {BuildingType} from "@/game/model/enums.ts";
import {PlayerService} from "@/game/logic/PlayerService.ts";

export class BuildingRender {
    private static imageCache: Map<string, HTMLImageElement> = new Map();
    private static coloredImageCache: Map<string, HTMLCanvasElement> = new Map();

    private static getStyle(building: Building, game: GameState): BuildingStyle {
        //Somehow obtain information about the player color. TODO fix this.
        const playerStyle = PlayerService.getPlayerStyle(game, building.playerName);
        return {
            imageSrc: BUILDING_STYLES[building.type].imageSrc,
            fillColor: playerStyle.fillColor,
        };
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

    private static getColoredIcon(style: BuildingStyle): HTMLImageElement | HTMLCanvasElement {
        const rawImage = this.getIcon(style);

        // If no color is specified, or image isn't loaded yet, return the raw image
        if (!style.fillColor || !rawImage.complete || rawImage.naturalWidth === 0) {
            return rawImage;
        }

        // Create a unique key for the cache
        const cacheKey = `${style.imageSrc}-${style.fillColor}`;

        if (!this.coloredImageCache.has(cacheKey)) {
            // Create an offscreen canvas
            const canvas = document.createElement('canvas');
            canvas.width = rawImage.naturalWidth;
            canvas.height = rawImage.naturalHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                // 1. Draw the original icon
                ctx.drawImage(rawImage, 0, 0);

                // 2. Change composite mode to keep the alpha (shape) but replace the color
                ctx.globalCompositeOperation = 'source-in';
                ctx.fillStyle = style.fillColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                this.coloredImageCache.set(cacheKey, canvas);
            }
        }

        return this.coloredImageCache.get(cacheKey) ?? rawImage;
    }

    public static draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, building: Building, game: GameState) {
        const center = HexLayoutService.vertexPolygonCorners(layoutSettings, building.vertex)[0];
        const style = this.getStyle(building, game);
        const image = this.getColoredIcon(style);

        if (image instanceof HTMLImageElement && !image.complete) return;

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
        const style = { ...BUILDING_STYLES[type], fillColor: color };
        const image = this.getColoredIcon(style);

        if (image instanceof HTMLImageElement && !image.complete) return;

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