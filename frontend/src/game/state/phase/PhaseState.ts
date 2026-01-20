import type { Tool } from "../tool/Tool";
import type {GameContext} from "@/game/state/GameStateHandler.ts";
import type {GameState} from "@/game/model/types.ts";
import type {ButtonType} from "@/game/model/enums.ts";

export abstract class PhaseState {
    abstract readonly phaseName: string;

    protected activeTools: Tool[] | null = null;
    protected availableTools: Tool[] = [];
    protected context?: GameContext;

    onEnter(game: GameState, context: GameContext): void {
        this.context = context;
        this.setupAvailableTools(game);
        this.setDefaultTool(game);
    }

    onExit(game: GameState): void {
        if (this.activeTool) {
            this.activeTool.onExit?.(game);
            this.activeTool = null;
            this.availableTools = [];
        }
    }

    setActiveTool(tool: Tool | null, game: GameState): void {
        if (this.activeTool) {
            this.activeTool.onExit?.(game);
        }

        this.activeTool = tool;

        if (this.activeTool && this.context) {
            this.activeTool.onEnter?.(game);
        }
    }

    getActiveTool(): Tool | null {
        return this.activeTool;
    }

    getAvailableTools(): Tool[] {
        return this.availableTools;
    }

    getHUDConfig(): HUDConfig {
        const buttons: ButtonType[] = [];

        // Add tool buttons
        this.availableTools.forEach(tool => {
            if (tool.triggerButton) {
                buttons.push(tool.triggerButton);
            }
        });

        // Add phase-specific buttons
        buttons.push(...this.getPhaseButtons());

        return {
            buttons,
            selectedButton: this.activeTool?.triggerButton
        };
    }

    abstract setupAvailableTools(game: GameState): void;
    abstract setDefaultTool(game: GameState): void;
    abstract getPhaseButtons(): ButtonType[];
}