import type {GameContext, GameStateHandler} from "@/game/state/GameStateHandler.ts";
import type {Button, GameState, GhostEffect, HUDEntities, LayoutSettings} from "@/game/model/types.ts";
import {TEST_HUD} from "@/game/model/testGame.ts";
import {ButtonType} from "@/game/model/enums.ts";
import {Logger} from "@/game/utils/Logger.ts";

export abstract class BaseGameState implements GameStateHandler {
    
    protected hudEntities?: HUDEntities;
    protected context?: GameContext;
    protected buttonMap: Map<ButtonType, Button> = new Map();

    onEnter(game: GameState, layoutSettings: LayoutSettings, context: GameContext): void {
        // Load shared buttons (e.g., from a config or the test HUD)
        // We clone them to ensure state (hover/select) is unique to this instance
        this.hudEntities = structuredClone(TEST_HUD);
        this.context = context;

        // Populate the map for O(1) access
        this.buttonMap.clear();
        this.hudEntities.buttons.forEach(btn => this.buttonMap.set(btn.type, btn));

        Logger.info("onEnter BaseGameState called");
    }

    onExit(game: GameState): void {
        //Cleaning memory
        this.hudEntities = undefined;
        this.buttonMap.clear();
    }

    onClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        if (this.hudEntities) {
            // Iterate backwards (from Top to Bottom) to ensure we click the button visually on top
            for (let i = this.hudEntities.buttons.length - 1; i >= 0; i--) {
                const btn = this.hudEntities.buttons[i];
                if (this.isPointInButton(x, y, btn)) {
                    this.handleButtonClick(btn.type, game);
                    return;
                }
            }
        }

        // If no button clicked, let child class handle the click
        this.onMapClick(x, y, game, layoutSettings);
    }

    onMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void {
        let handled = false;
        let stateChanged = false;

        //Check to make the lint happy
        if (!this.hudEntities) return;

        // Handle Hover Logic
        this.hudEntities.buttons.forEach(button => {
            const wasHovered = button.isHovered;
            button.isHovered = this.isPointInButton(x, y, button);
            
            if (button.isHovered) handled = true;
            if (wasHovered !== button.isHovered) stateChanged = true;
        });

        // Sort buttons if state changed to ensure Render Order: Normal < Selected < Hovered
        if (stateChanged) {
            this.sortButtons()
        }

        if (!handled) {
            this.onMapMouseMove(x, y, game, layoutSettings);
        }
    }

    getHUDEntities(): HUDEntities | undefined {
        return this.hudEntities;
    }

    getGhostEffects(): GhostEffect[] {
        throw new Error("Method not implemented.");
    }

    // --- Helpers ---

    protected sortButtons() {
        if (!this.hudEntities) return;

        this.hudEntities.buttons.sort((a, b) => {
            const getPriority = (btn: Button) => {
                if (btn.isHovered) return 2;
                if (btn.isSelected) return 1;
                return 0;
            };
            return getPriority(a) - getPriority(b);
        });
    }

    protected isPointInButton(x: number, y: number, button: Button): boolean {
        const l = button.layout;
        return x >= l.x && x <= l.x + l.width &&
               y >= l.y && y <= l.y + l.height;
    }

    protected handleButtonClick(type: ButtonType, game: GameState) {
        console.log("Button Clicked:", type);
        this.context?.handleButtonAction(type);
    }

    protected setButtonSelectedState(type: ButtonType, isSelected: boolean) {
        const button = this.buttonMap.get(type);
        if (button) button.isSelected = isSelected;
    }

    // --- Abstract / Overridable methods for child classes ---
    
    // Child classes implement this instead of onClick to avoid re-implementing button logic
    protected abstract onMapClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void;

    protected abstract onMapMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void;

}