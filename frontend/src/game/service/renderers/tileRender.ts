import type {Hex, LayoutSettings, Point, Tile} from "@/game/model/types.ts";
import {HexLayoutService} from "@/game/service/layout/hexLayoutService.ts";
import {FIXED_STYLES, type FixedTileKind, RESOURCE_STYLES, type TileStyle} from "@/game/theme/tileStyles.ts";
import {TileKind} from "@/game/model/enums.ts";
import {Logger} from "@/game/utils/Logger.ts";

export class TileRender {
    //Used to translate coordinates into string keys.
    public static defaultIconHeightOffset = 15;
    public static defaultLabelColor = "#FFF";
    public static defaultFontStyle = "10px Verdana, Arial, sans-serif";
    public static defaultIconScale = 1.0;

    //Image cache (Performance enhancing)
    private static imageCache: Map<string, HTMLImageElement> = new Map();
    private static coloredImageCache: Map<string, HTMLCanvasElement> = new Map();

    private static hexToPath(layoutSettings: LayoutSettings, hex: Hex): Path2D {
        const polygon = HexLayoutService.hexPolygonCorners(layoutSettings, hex);
        const path = new Path2D();
        path.moveTo(polygon[0].x, polygon[0].y);
        for (let i = 1; i < polygon.length; i++) {
            path.lineTo(polygon[i].x, polygon[i].y);
        }
        path.lineTo(polygon[0].x, polygon[0].y);
        path.closePath();
        return path;
    }

    private static getStyle(tile: Tile): TileStyle {
        // Case 1: It's a Resource Tile (Look at resourceType)
        if (tile.tileKind === TileKind.ResourceTile) {
            if (!tile.resourceType) {
                // Fallback for error state (e.g. a resource tile with no type defined)
                Logger.warn({ tile }, 'ResourceTile missing resourceType');
                return FIXED_STYLES[TileKind.DessertTile];
            }
            return RESOURCE_STYLES[tile.resourceType];
        }

        // Case 2: It's a Fixed Tile (Sea, Desert, etc.)
        // We cast to FixedTileKind because we know it's not ResourceTile here
        return FIXED_STYLES[tile.tileKind as FixedTileKind];
    }

    private static getIcon(style: TileStyle): HTMLImageElement {
        const src = style.imageSrc;
        if (!this.imageCache.has(style.imageSrc)) {
            const img = new Image();
            img.src = style.imageSrc;
            this.imageCache.set(style.imageSrc, img);
        }
        return this.imageCache.get(src)!;
    }

    private static getColoredIcon(style: TileStyle): HTMLImageElement | HTMLCanvasElement {
        const rawImage = this.getIcon(style);

        // If no color is specified, or image isn't loaded yet, return the raw image
        if (!style.iconColor || !rawImage.complete || rawImage.naturalWidth === 0) {
            return rawImage;
        }

        // Create a unique key for the cache (e.g., "assets/wood.svg-#FFFFFF")
        const cacheKey = `${style.imageSrc}-${style.iconColor}`;

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
                ctx.fillStyle = style.iconColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                this.coloredImageCache.set(cacheKey, canvas);
            }
        }

        return this.coloredImageCache.get(cacheKey) ?? rawImage;
    }

    private static drawIcon(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, tile: Tile, style: TileStyle) {
        //Get the center.
        const center: Point = HexLayoutService.hexToPixel(layoutSettings, tile.hex);
        const image = this.getColoredIcon(style);
        
        if (image instanceof HTMLImageElement && (!image.complete || image.naturalWidth === 0)) return;

        const scale = style.iconScale ?? TileRender.defaultIconScale;
        const iconWidth = (layoutSettings.size.x / 2) * scale;
        const iconHeight = (layoutSettings.size.y / 2) * scale;

        ctx.beginPath()
        ctx.drawImage(image, 
            center.x - iconWidth, 
            center.y - iconHeight - TileRender.defaultIconHeightOffset,
            iconWidth * 2, 
            iconHeight * 2
        );
        ctx.closePath();
    }

    private static drawBackground(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, tile: Tile, style: TileStyle) {
        ctx.beginPath()
        ctx.fillStyle = style.fillColor;
        ctx.fill(this.hexToPath(layoutSettings, tile.hex));
        ctx.closePath();
    }

    private static drawNumber(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, tile: Tile, style: TileStyle) {
        const center: Point = HexLayoutService.hexToPixel(layoutSettings, tile.hex);
        const scale = style.iconScale ?? TileRender.defaultIconScale;
        const iconHeight = (layoutSettings.size.y / 2) * scale;
        ctx.beginPath();
        ctx.fillStyle = style.labelColor ?? this.defaultLabelColor;
        ctx.font = style.fontStyle ?? this.defaultFontStyle;
        ctx.fillText(tile.dice?.toString() ?? "Error", center.x -10, center.y + iconHeight + 15);
        ctx.closePath();
    }

    public static draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, tile: Tile) {
        const style = this.getStyle(tile);

        this.drawBackground(ctx, layoutSettings, tile, style);
        this.drawIcon(ctx, layoutSettings, tile, style);

        if (tile.dice) {
            this.drawNumber(ctx, layoutSettings, tile, style);
        }
    }
}