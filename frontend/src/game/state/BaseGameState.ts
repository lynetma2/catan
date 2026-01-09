import type {GameStateHandler} from "@/game/state/GameStateHandler.ts";
import type {Button, GameState, HUDEntities, LayoutSettings} from "@/game/model/types.ts";
import {TEST_HUD} from "@/game/model/testGame.ts";
import {ButtonType} from "@/game/model/enums.ts";
import {Logger} from "@/game/utils/Logger.ts";

export abstract class BaseGameState implements GameStateHandler {
    protected hudEntities?: HUDEntities;

    onEnter(game: GameState, layoutSettings: LayoutSettings): void {
        // Load shared buttons (e.g., from a config or the test HUD)
        // We clone them to ensure state (hover/select) is unique to this instance
        this.hudEntities = structuredClone(TEST_HUD);
        Logger.info("onEnter BaseGameState called");
    }

    onExit(game: GameState): void {
        //Cleaning memory
        this.hudEntities = undefined;
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
            this.hudEntities.buttons.sort((a, b) => {
                const getPriority = (btn: Button) => {
                    if (btn.isHovered) return 2;
                    if (btn.isSelected) return 1;
                    return 0;
                };
                return getPriority(a) - getPriority(b);
            });
        }

        if (!handled) {
            this.onMapMouseMove(x, y, game, layoutSettings);
        }
    }

    getHUDEntities(): HUDEntities | undefined {
        console.log("getHUDEntities called returned the following: ", this.hudEntities);
        return this.hudEntities;
    }

    // --- Helpers ---

    protected isPointInButton(x: number, y: number, button: Button): boolean {
        const l = button.layout;
        return x >= l.x && x <= l.x + l.width &&
               y >= l.y && y <= l.y + l.height;
    }

    protected handleButtonClick(type: ButtonType, game: GameState) {
        console.log("Button Clicked:", type);
        // Here you would switch states or trigger actions
        // e.g. if (type === ButtonType.putRoad) gameLoop.setGameState(new BuildRoadState());
    }

    // --- Abstract / Overridable methods for child classes ---
    
    // Child classes implement this instead of onClick to avoid re-implementing button logic
    protected abstract onMapClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void;

    protected abstract onMapMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void;
}