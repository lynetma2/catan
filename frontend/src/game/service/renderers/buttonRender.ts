import type {Button, Hex, LayoutSettings, Point, Tile} from "@/game/model/types.ts";
import {Logger} from "@/game/utils/Logger.ts";
import {BUTTON_STYLES, type ButtonStyle} from "@/game/theme/buttonStyles";
import {type UiLayout, HUDLayoutService} from "@/game/service/layout/HUDLayoutService.ts";

export class ButtonRender {

    //Image cache (Performance enhancing)
    private static imageCache: Map<string, HTMLImageElement> = new Map();
    private static coloredImageCache: Map<string, HTMLCanvasElement> = new Map();

    private static getLocalPlayerStyle(button: Button): ButtonStyle {
        const styles = BUTTON_STYLES[button.type];

        //TODO Update color to the current user.
        return styles;
    }

    private static getRectPath(layout: UiLayout): Path2D {
        const path = new Path2D();
        path.rect(layout.x, layout.y, layout.width, layout.height);
        path.closePath();
        return path;
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

    private static drawIcon(ctx: CanvasRenderingContext2D, layout: UiLayout, style: ButtonStyle) {
        const img = this.getColoredIcon(style);
        if (!img) return;
        
        ctx.drawImage(img, layout.x, layout.y, layout.width, layout.height);
    }

    private static drawBackground(ctx: CanvasRenderingContext2D, button: Button, style: ButtonStyle) {
        const layout = button.layout;
        ctx.beginPath();
        // Draw a circle background slightly larger than the icon
        const path = this.getRectPath(layout);

        ctx.fillStyle = "#FFF";
        ctx.fill(path);
        
        if (button.isHovered) {
            ctx.lineWidth = 4 * layout.scale;
            ctx.strokeStyle = "#FFD700"; // Gold selection
            ctx.stroke(path);
            return;
        }

        // Hover effect or default stroke
        if (style.strokeColor) {
            ctx.lineWidth = 3 * layout.scale;
            ctx.strokeStyle = style.strokeColor;
            ctx.stroke(path);
        }
        ctx.closePath();
    }

    public static draw(ctx: CanvasRenderingContext2D, button: Button) {
        const style = this.getLocalPlayerStyle(button);

        // Simple scale effect on hover
        if (button.isHovered) {
            // Note: Modifying layout here might be jittery if not handled carefully in logic.
            // Ideally, draw slightly larger without changing the hit-box, or use a transform.
        }

        this.drawBackground(ctx, button, style);
        this.drawIcon(ctx, button.layout, style);

    }
}