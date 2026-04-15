import type { Rect } from "@/game/utils/Rect.ts";
import type {ButtonLayout} from "@/game/hud/panels/tradeOffer/types.ts";

// ─── Theme ────────────────────────────────────────────────────────────────────

export interface ButtonRendererTheme {
    accept: ButtonColors;
    reject: ButtonColors;
    font:   string;
    radius: number;
}

export interface ButtonColors {
    background:        string;
    backgroundHovered: string;
    backgroundPressed: string;
    label:             string;
    label_text:        string;
}

export const defaultButtonRendererTheme: ButtonRendererTheme = {
    accept: {
        background:        "#1D9E75",
        backgroundHovered: "#22b585",
        backgroundPressed: "#178a63",
        label:             "Accept",
        label_text:        "#ffffff",
    },
    reject: {
        background:        "#E24B4A",
        backgroundHovered: "#f05554",
        backgroundPressed: "#c73f3e",
        label:             "Reject",
        label_text:        "#ffffff",
    },
    font:   "500 11px sans-serif",
    radius: 4,
};

// ─── Renderer ─────────────────────────────────────────────────────────────────

export type ButtonInteractionState = "idle" | "hovered" | "pressed";

export interface ButtonRenderState {
    accept: ButtonInteractionState;
    reject: ButtonInteractionState;
}

export const idleButtonRenderState: ButtonRenderState = {
    accept: "idle",
    reject: "idle",
};

export class ButtonRenderer {
    constructor(
        private readonly ctx:   CanvasRenderingContext2D,
        private readonly theme: ButtonRendererTheme,
    ) {}

    render(
        layout:       ButtonLayout,
        interaction:  ButtonRenderState,
    ): void {
        this.drawButton(layout.acceptBounds, this.theme.accept, interaction.accept);
        this.drawButton(layout.rejectBounds, this.theme.reject, interaction.reject);
    }

    private drawButton(
        bounds:      Rect,
        colors:      ButtonColors,
        interaction: ButtonInteractionState,
    ): void {
        this.drawBackground(bounds, colors, interaction);
        this.drawLabel(bounds, colors);
    }

    private drawBackground(
        bounds:      Rect,
        colors:      ButtonColors,
        interaction: ButtonInteractionState,
    ): void {
        const ctx = this.ctx;
        const { x, y, width, height } = bounds;

        ctx.beginPath();
        ctx.roundRect(x, y, width, height, this.theme.radius);
        ctx.fillStyle = this.resolveBackground(colors, interaction);
        ctx.fill();
    }

    private drawLabel(bounds: Rect, colors: ButtonColors): void {
        const ctx = this.ctx;
        ctx.font         = this.theme.font;
        ctx.fillStyle    = colors.label_text;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            colors.label,
            bounds.x + bounds.width  / 2,
            bounds.y + bounds.height / 2,
        );
    }

    private resolveBackground(
        colors:      ButtonColors,
        interaction: ButtonInteractionState,
    ): string {
        switch (interaction) {
            case "hovered": return colors.backgroundHovered;
            case "pressed": return colors.backgroundPressed;
            default:        return colors.background;
        }
    }
}