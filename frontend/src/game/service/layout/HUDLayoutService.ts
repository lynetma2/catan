import { ButtonType } from "@/game/model/enums.ts";
import layoutConfig from "@/game/config/hudLayout.json";

export interface UiLayout {
    x: number;      // Center X in pixels
    y: number;      // Center Y in pixels
    width: number;  // Width in pixels
    height: number; // Height in pixels
    scale: number;  // Scale factor applied
}

type Anchor = "TOP_LEFT" | "TOP_CENTER" | "TOP_RIGHT" | 
              "MIDDLE_LEFT" | "CENTER" | "MIDDLE_RIGHT" | 
              "BOTTOM_LEFT" | "BOTTOM_CENTER" | "BOTTOM_RIGHT";

export class HUDLayoutService {

    public static getLayout(buttonType: ButtonType, canvasWidth: number, canvasHeight: number): UiLayout {

        const elementConfig = this.getElementConfig(buttonType);
        
        // 1. Calculate GUI Scale
        const guiScale = Math.max(1, Math.floor(canvasWidth / layoutConfig.settings.guiScaleStep));
        
        // 2. Calculate Anchor Position
        let anchorX = 0;
        let anchorY = 0;
        const anchor: Anchor = elementConfig.anchor;

        if (anchor.includes("LEFT")) anchorX = 0;
        else if (anchor.includes("RIGHT")) anchorX = canvasWidth;
        else anchorX = canvasWidth / 2;

        if (anchor.includes("TOP")) anchorY = 0;
        else if (anchor.includes("BOTTOM")) anchorY = canvasHeight;
        else anchorY = canvasHeight / 2;

        // 3. Apply Offsets & Scale
        // Offset defines the position of the Top-Left corner relative to the Anchor.
        const finalX = anchorX + (elementConfig.offset.x * guiScale);
        const finalY = anchorY + (elementConfig.offset.y * guiScale);
        const finalWidth = elementConfig.size.width * guiScale;
        const finalHeight = elementConfig.size.height * guiScale;

        return {
            x: finalX,
            y: finalY,
            width: finalWidth,
            height: finalHeight,
            scale: guiScale
        };
    }

    private static getElementConfig(buttonType: ButtonType) {
        let key = typeof buttonType === 'number' ? ButtonType[buttonType] : buttonType as string;
        key = key.charAt(0).toLowerCase() + key.slice(1);

        // @ts-ignore - Typescript might complain about JSON indexing, but it works in Vite
        const elementConfig = layoutConfig.elements[key];

        // Fallback if config is missing
        if (!elementConfig) {
            console.warn(`JSON file missing config for: ${buttonType} (key: ${key}). Fallback used.`);
            return { 
                anchor: "TOP_LEFT", 
                offset: { x: 0, y: 0 }, 
                size: { width: 50, height: 50 } 
            };
        }

        return elementConfig;
    }
}