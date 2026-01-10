import { ButtonType } from "@/game/model/enums.ts";
import layoutConfigRaw from "@/game/config/hudLayout.json";

export interface UiLayout {
    x: number;      // Center X in pixels
    y: number;      // Center Y in pixels
    width: number;  // Width in pixels
    height: number; // Height in pixels
}

export type Anchor = "TOP_LEFT" | "TOP_CENTER" | "TOP_RIGHT" | 
              "MIDDLE_LEFT" | "CENTER" | "MIDDLE_RIGHT" | 
              "BOTTOM_LEFT" | "BOTTOM_CENTER" | "BOTTOM_RIGHT";

interface ElementConfig {
    anchor: Anchor;
    offset: { x: number; y: number };
    size: { width: number; height: number };
}

interface ContainerConfig {
    anchor: Anchor;
    offset: { x: number; y: number };
    cardSize: { width: number; height: number };
    spacing: number;
    hoverOffset: number;
    maxWidthRatio: number;
}

interface LayoutConfig {
    settings: {
        baseScale: number;
        guiScaleStep: number;
    };
    buttons: Record<string, ElementConfig>;
    containers: {
        playerHand: ContainerConfig;
    };
}

const layoutConfig = layoutConfigRaw as unknown as LayoutConfig;

export class HUDLayoutService {

    public static getHandCardLayout(index: number, totalCards: number, canvasWidth: number, canvasHeight: number): UiLayout {
        // 1. Get Config
        const config = layoutConfig.containers.playerHand;
        
        // 2. Calculate GUI Scale
        const guiScale = Math.max(1, Math.floor(canvasWidth / layoutConfig.settings.guiScaleStep));

        // 3. Calculate Dimensions
        const cardWidth = config.cardSize.width * guiScale;
        const cardHeight = config.cardSize.height * guiScale;
        const defaultSpacing = config.spacing * guiScale;
        const maxWidth = canvasWidth * config.maxWidthRatio;

        // 4. Calculate Spacing (Adaptive Squeezing)
        let spacing = defaultSpacing;
        // Total width = 1 card + (N-1) * (card + spacing)
        const idealTotalWidth = cardWidth + (Math.max(0, totalCards - 1) * (cardWidth + defaultSpacing));

        if (totalCards > 1 && idealTotalWidth > maxWidth) {
            const availableSpace = maxWidth - cardWidth;
            const gaps = totalCards - 1;
            // stride is the distance from start of one card to start of next
            const stride = availableSpace / gaps;
            spacing = stride - cardWidth;
        }

        const actualTotalWidth = cardWidth + (Math.max(0, totalCards - 1) * (cardWidth + spacing));

        // 5. Calculate Anchor Position
        let anchorX = 0;
        let anchorY = 0;
        const anchor: Anchor = config.anchor;

        if (anchor.includes("LEFT")) anchorX = 0;
        else if (anchor.includes("RIGHT")) anchorX = canvasWidth;
        else anchorX = canvasWidth / 2;

        if (anchor.includes("TOP")) anchorY = 0;
        else if (anchor.includes("BOTTOM")) anchorY = canvasHeight;
        else anchorY = canvasHeight / 2;

        // 6. Calculate Origin Shift (Treating the whole hand as one block)
        let originShiftX = 0;
        let originShiftY = 0;

        if (anchor.includes("RIGHT")) originShiftX = -actualTotalWidth;
        else if (anchor.includes("CENTER") || anchor === "CENTER") originShiftX = -actualTotalWidth / 2;

        if (anchor.includes("BOTTOM")) originShiftY = -cardHeight;
        else if (anchor.includes("MIDDLE") || anchor === "CENTER") originShiftY = -cardHeight / 2;

        // 7. Calculate Start Position of the Hand
        const handStartX = anchorX + (config.offset.x * guiScale) + originShiftX;
        const handStartY = anchorY + (config.offset.y * guiScale) + originShiftY;

        // 8. Calculate Specific Card Position
        const cardX = handStartX + (index * (cardWidth + spacing));
        const cardY = handStartY;

        return {
            x: cardX,
            y: cardY,
            width: cardWidth,
            height: cardHeight
        };
    }

    public static getButtonLayout(buttonType: ButtonType, canvasWidth: number, canvasHeight: number): UiLayout {

        const elementConfig = this.getButtonConfig(buttonType);
        
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
        };
    }

    private static getButtonConfig(buttonType: ButtonType): ElementConfig {
        let key = typeof buttonType === 'number' ? ButtonType[buttonType] : buttonType as string;
        key = key.charAt(0).toLowerCase() + key.slice(1);

        const elementConfig = layoutConfig.buttons[key];

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