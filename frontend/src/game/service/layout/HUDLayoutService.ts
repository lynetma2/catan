import { ButtonType } from "@/game/model/enums.ts";

export interface UiLayout {
    x: number;      // Center X in pixels
    y: number;      // Center Y in pixels
    width: number;  // Width in pixels
    height: number; // Height in pixels
    scale: number;  // Scale factor applied
}

export class HUDLayoutService {
    private static readonly REF_WIDTH = 1920;
    private static readonly REF_HEIGHT = 1080;
    private static readonly BASE_BUTTON_SIZE = 80; // Base size in pixels at 1080p

    // Configuration: Position as percentage of screen (0.0 to 1.0)
    private static readonly CONFIGS: Partial<Record<ButtonType, { x: number, y: number, scale?: number }>> = {
        [ButtonType.drawDevelopmentCard]: { x: 0.05, y: 0.92, scale: 1.0 },

        // Bottom Action Bar
        [ButtonType.putRoad]:       { x: 0.35, y: 0.92, scale: 0.9 },
        [ButtonType.putSettlement]: { x: 0.42, y: 0.92, scale: 0.9 },
        [ButtonType.putCity]:       { x: 0.49, y: 0.92, scale: 0.9 },

        // Main Controls
        [ButtonType.endTurn]:       { x: 0.92, y: 0.92, scale: 1.2 },
        [ButtonType.waiting]:       { x: 0.50, y: 0.10, scale: 1.0 },
    };

    public static getLayout(buttonType: ButtonType, canvasWidth: number, canvasHeight: number): UiLayout {
        const config = this.CONFIGS[buttonType] ?? { x: 0.5, y: 0.5, scale: 1.0 };

        // Calculate scale: Use the smaller dimension ratio to ensure it fits on mobile/portrait
        const scaleX = canvasWidth / this.REF_WIDTH;
        const scaleY = canvasHeight / this.REF_HEIGHT;
        const finalScale = Math.min(scaleX, scaleY) * (config.scale ?? 1.0);

        const size = this.BASE_BUTTON_SIZE * finalScale;

        return {
            x: canvasWidth * config.x,
            y: canvasHeight * config.y,
            width: size,
            height: size,
            scale: finalScale
        };
    }
}