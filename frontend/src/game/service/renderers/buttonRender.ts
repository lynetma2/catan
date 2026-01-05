import type {Button, Hex, LayoutSettings, Point, Tile} from "@/game/model/types.ts";
import {LayoutService} from "@/game/service/LayoutService.ts";
import {FIXED_STYLES, type FixedTileKind, RESOURCE_STYLES, type TileStyle} from "@/game/theme/tileStyles.ts";
import {TileKind} from "@/game/model/enums.ts";
import {Logger} from "@/game/utils/Logger.ts";
import type { ButtonStyle } from "@/game/theme/buttonStyles";

export class ButtonRender {

    //Image cache (Performance enhancing)
    private static imageCache: Map<string, HTMLImageElement> = new Map();
    private static coloredImageCache: Map<string, HTMLCanvasElement> = new Map();

    private static getStyle(button: Button): ButtonStyle {

    }

    private static getIcon(style: ButtonStyle): HTMLImageElement {
        const src = style.imageSrc;
        if (!this.imageCache.has(style.imageSrc)) {
            const img = new Image();
            img.src = style.imageSrc;
            this.imageCache.set(style.imageSrc, img);
        }
        return this.imageCache.get(src)!;
    }

    private static getColoredIcon(style: ButtonStyle): HTMLImageElement | HTMLCanvasElement {
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

    private static drawIcon(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, button: Button, style: ButtonStyle) {

    }

    private static drawBackground(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, button: Button, style: ButtonStyle) {

    }

    public static draw(ctx: CanvasRenderingContext2D, layoutSettings: LayoutSettings, button: Button) {
        const style = this.getStyle(button);

        this.drawBackground(ctx, layoutSettings, button, style);
        this.drawIcon(ctx, layoutSettings, button, style);
    }
}