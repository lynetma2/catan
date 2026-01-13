import { Anchor, ButtonType } from "@/game/model/enums.ts";
import layoutConfigRaw from "@/game/config/hudLayout.json";

export interface UiLayout {
    x: number;      // Top left X in pixels
    y: number;      // Top left Y in pixels
    width: number;  // Width in pixels
    height: number; // Height in pixels
}

export interface PlayerPanelLayout {
    container: UiLayout;
    internal: {
        padding: number;
        fontSize: number;
        iconSize: number;
    }
}

type AnchorString = "TOP_LEFT" | "TOP_CENTER" | "TOP_RIGHT" |
                    "MIDDLE_LEFT" | "CENTER" | "MIDDLE_RIGHT" |
                    "BOTTOM_LEFT" | "BOTTOM_CENTER" | "BOTTOM_RIGHT";

const STRING_TO_ANCHOR: Record<string, Anchor> = {
    "TOP_LEFT": Anchor.TopLeft,
    "TOP_CENTER": Anchor.TopCenter,
    "TOP_RIGHT": Anchor.TopRight,
    "MIDDLE_LEFT": Anchor.MiddleLeft,
    "CENTER": Anchor.Center,
    "MIDDLE_RIGHT": Anchor.MiddleRight,
    "BOTTOM_LEFT": Anchor.BottomLeft,
    "BOTTOM_CENTER": Anchor.BottomCenter,
    "BOTTOM_RIGHT": Anchor.BottomRight
};

const ANCHOR_FACTORS: Record<Anchor, { x: number, y: number }> = {
    [Anchor.TopLeft]: { x: 0, y: 0 },
    [Anchor.TopCenter]: { x: 0.5, y: 0 },
    [Anchor.TopRight]: { x: 1, y: 0 },
    [Anchor.MiddleLeft]: { x: 0, y: 0.5 },
    [Anchor.Center]: { x: 0.5, y: 0.5 },
    [Anchor.MiddleRight]: { x: 1, y: 0.5 },
    [Anchor.BottomLeft]: { x: 0, y: 1 },
    [Anchor.BottomCenter]: { x: 0.5, y: 1 },
    [Anchor.BottomRight]: { x: 1, y: 1 },
};

interface ElementConfig {
    anchor: AnchorString;
    offset: { x: number; y: number };
    size: { width: number; height: number };
}

interface PlayerHandConfig {
    anchor: AnchorString;
    offset: { x: number; y: number };
    cardSize: { width: number; height: number };
    spacing: number;
    hoverOffset: number;
    maxWidthRatio: number;
}

interface PlayerOverviewConfig {
    anchor: AnchorString;
    offset: { x: number; y: number };
    panelSize: { width: number; height: number };
    spacing: number;
    internal: {
        padding: number;
        fontSize: number;
        iconSize: number;
    }
}

interface DiceConfig {
    anchor: AnchorString;
    offset: { x: number; y: number };
    size: number;
    spacing: number;
}

interface LayoutConfig {
    settings: {
        baseScale: number;
        guiScaleStep: number;
    };
    buttons: Record<string, ElementConfig>;
    containers: {
        playerHand: PlayerHandConfig;
        playerOverview: PlayerOverviewConfig;
        dice: DiceConfig;
    };
}

const layoutConfig = layoutConfigRaw as unknown as LayoutConfig;

export class HUDLayoutService {

    // --- Helper Methods ---

    private static getGuiScale(canvasWidth: number): number {
        return Math.max(1, Math.floor(canvasWidth / layoutConfig.settings.guiScaleStep));
    }

    private static getAnchorCoordinates(anchor: Anchor, canvasWidth: number, canvasHeight: number): { x: number, y: number } {
        const factors = ANCHOR_FACTORS[anchor];
        return {
            x: canvasWidth * factors.x,
            y: canvasHeight * factors.y
        };
    }

    /**
     * Calculates the translation required to align the element's anchor point (e.g. Bottom-Right corner)
     * with the screen's anchor point.
     *
     * Without this shift, drawing always starts at the Top-Left of the element.
     *
     * Example: Anchor = BOTTOM_RIGHT
     * - Screen Point: (CanvasWidth, CanvasHeight)
     * - Element Origin: Top-Left
     * - Shift: x = -width, y = -height
     * - Result: The element is drawn entirely to the Left and Up of the Screen Point.
     *
     * This ensures that an offset of {0,0} places the element perfectly flush against the corner/edge.
     */
    private static getOriginShift(anchor: Anchor, width: number, height: number): { x: number, y: number } {
        const factors = ANCHOR_FACTORS[anchor];
        return {
            x: -width * factors.x,
            y: -height * factors.y
        };
    }

    // --- Public Layout Methods ---

    public static getHandCardLayout(index: number, totalCards: number, canvasWidth: number, canvasHeight: number): UiLayout {
        // 1. Get Config
        const config = layoutConfig.containers.playerHand;
        
        // 2. Calculate GUI Scale
        const guiScale = this.getGuiScale(canvasWidth);

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
        const anchor = STRING_TO_ANCHOR[config.anchor];
        const anchorPos = this.getAnchorCoordinates(anchor, canvasWidth, canvasHeight);

        // 6. Calculate Origin Shift
        // Shifts the drawing origin so the entire hand block aligns with the anchor point.
        const originShift = this.getOriginShift(anchor, actualTotalWidth, cardHeight);

        // 7. Calculate Start Position (Screen Anchor + JSON Offset + Alignment Shift)
        const handStartX = anchorPos.x + (config.offset.x * guiScale) + originShift.x;
        const handStartY = anchorPos.y + (config.offset.y * guiScale) + originShift.y;

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

    public static getPlayerPanelLayout(index: number, canvasWidth: number, canvasHeight: number): PlayerPanelLayout {
        const config = layoutConfig.containers.playerOverview;
        const guiScale = this.getGuiScale(canvasWidth);

        const panelWidth = config.panelSize.width * guiScale;
        const panelHeight = config.panelSize.height * guiScale;
        const spacing = config.spacing * guiScale;

        const anchor = STRING_TO_ANCHOR[config.anchor];
        const anchorPos = this.getAnchorCoordinates(anchor, canvasWidth, canvasHeight);
        
        // Shift origin so the panel aligns with the anchor (e.g. Top-Right corner of panel at Top-Right of screen)
        const originShift = this.getOriginShift(anchor, panelWidth, panelHeight);

        // Calculate Stacking
        // If anchored TOP, flow down (+1). If anchored BOTTOM, flow up (-1).
        const flowDirection = ANCHOR_FACTORS[anchor].y === 1 ? -1 : 1;
        const stackOffset = index * (panelHeight + spacing) * flowDirection;

        // Final Position = Anchor Point + JSON Offset + Alignment Shift + Stack Offset
        const x = anchorPos.x + (config.offset.x * guiScale) + originShift.x;
        const y = anchorPos.y + (config.offset.y * guiScale) + originShift.y + stackOffset;

        return {
            container: {
                x,
                y,
                width: panelWidth,
                height: panelHeight
            },
            internal: {
                padding: config.internal.padding * guiScale,
                fontSize: config.internal.fontSize * guiScale,
                iconSize: config.internal.iconSize * guiScale
            }
        };
    }

    public static getDiceLayout(canvasWidth: number, canvasHeight: number): UiLayout[] {
        const config = layoutConfig.containers.dice;
        if (!config) {
            return [];
        }

        const guiScale = this.getGuiScale(canvasWidth);

        const size = config.size * guiScale;
        const spacing = config.spacing * guiScale;

        // Total width of 2 dice + spacing
        const totalWidth = (size * 2) + spacing;
        const totalHeight = size;

        const anchor = STRING_TO_ANCHOR[config.anchor];
        const anchorPos = this.getAnchorCoordinates(anchor, canvasWidth, canvasHeight);

        // Shift origin so the dice block aligns with the anchor
        const originShift = this.getOriginShift(anchor, totalWidth, totalHeight);

        const startX = anchorPos.x + (config.offset.x * guiScale) + originShift.x;
        const startY = anchorPos.y + (config.offset.y * guiScale) + originShift.y;

        return [
            { x: startX, y: startY, width: size, height: size },
            { x: startX + size + spacing, y: startY, width: size, height: size }
        ];
    }

    public static getButtonLayout(buttonType: ButtonType, canvasWidth: number, canvasHeight: number): UiLayout {

        const elementConfig = this.getButtonConfig(buttonType);
        
        // 1. Calculate GUI Scale
        const guiScale = this.getGuiScale(canvasWidth);
        
        const anchor = STRING_TO_ANCHOR[elementConfig.anchor];

        // 2. Calculate Anchor Position
        const anchorPos = this.getAnchorCoordinates(anchor, canvasWidth, canvasHeight);

        // 3. Apply Offsets & Scale
        const finalWidth = elementConfig.size.width * guiScale;
        const finalHeight = elementConfig.size.height * guiScale;

        // Shift origin so the element aligns with the anchor (e.g. Bottom-Right corner of button at Bottom-Right of screen)
        const originShift = this.getOriginShift(anchor, finalWidth, finalHeight);

        // Final Position = Anchor Point + JSON Offset + Alignment Shift
        const finalX = anchorPos.x + (elementConfig.offset.x * guiScale) + originShift.x;
        const finalY = anchorPos.y + (elementConfig.offset.y * guiScale) + originShift.y;

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