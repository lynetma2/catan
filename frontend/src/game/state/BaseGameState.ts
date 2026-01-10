import type {GameContext, GameStateHandler} from "@/game/state/GameStateHandler.ts";
import type {Button, GameState, GhostEffect, HandCard, HUDEntities, LayoutSettings} from "@/game/model/types.ts";
import {TEST_HUD} from "@/game/model/testGame.ts";
import {ButtonType, ResourceType} from "@/game/model/enums.ts";
import {Logger} from "@/game/utils/Logger.ts";
import {HUDLayoutService, type UiLayout} from "@/game/service/layout/HUDLayoutService.ts";

export abstract class BaseGameState implements GameStateHandler {
    
    protected hudEntities?: HUDEntities;
    protected context?: GameContext;
    protected buttonMap: Map<ButtonType, Button> = new Map();

    onEnter(game: GameState, layoutSettings: LayoutSettings, context: GameContext): void {
        // Load shared buttons (e.g., from a config or the test HUD)
        // We clone them to ensure state (hover/select) is unique to this instance
        this.hudEntities = structuredClone(TEST_HUD);
        this.hudEntities.cards = []; // Ensure cards are initialized empty
        this.context = context;

        // Generate Hand Cards based on local player resources
        this.updateHandCards(game, layoutSettings);

        // Generate Player Panels
        this.updatePlayerPanels(game, layoutSettings);

        // Recalculate Layouts based on current Viewport (Buttons, and refresh others)
        this.recalculateLayout(layoutSettings);

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
            // 1. Check Buttons (Top Priority)
            // Iterate backwards (from Top to Bottom) to ensure we click the button visually on top
            for (let i = this.hudEntities.buttons.length - 1; i >= 0; i--) {
                const btn = this.hudEntities.buttons[i];
                if (this.isPointInButton(x, y, btn)) {
                    this.handleButtonClick(btn.type, game);
                    return;
                }
            }

            // 2. Check Cards
            // Iterate backwards because cards overlap (last one is on top)
            for (let i = this.hudEntities.cards.length - 1; i >= 0; i--) {
                const card = this.hudEntities.cards[i];
                if (this.isPointInLayout(x, y, card.layout)) {
                    this.handleCardClick(card, game);
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
        
        // Handle Card Hover
        // We iterate backwards for hit testing to respect Z-order (top card first)
        let cardHoverHandled = false;
        for (let i = this.hudEntities.cards.length - 1; i >= 0; i--) {
            const card = this.hudEntities.cards[i];
            const wasHovered = card.isHovered;
            
            // Only allow one card to be hovered at a time (the top-most one under cursor)
            if (!cardHoverHandled && this.isPointInLayout(x, y, card.layout)) {
                card.isHovered = true;
                cardHoverHandled = true;
                handled = true;
            } else {
                card.isHovered = false;
            }

            if (wasHovered !== card.isHovered) stateChanged = true; // Trigger redraw if hover changed
        }

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

    protected isPointInLayout(x: number, y: number, layout: UiLayout): boolean {
        return x >= layout.x && x <= layout.x + layout.width &&
               y >= layout.y && y <= layout.y + layout.height;
    }

    protected isPointInButton(x: number, y: number, button: Button): boolean {
        return this.isPointInLayout(x, y, button.layout);
    }

    protected handleButtonClick(type: ButtonType, game: GameState) {
        console.log("Button Clicked:", type);
        this.context?.handleButtonAction(type);
    }

    protected handleCardClick(card: HandCard, game: GameState) {
        console.log("Card Clicked:", card.resourceType);
        card.isSelected = !card.isSelected;
    }

    protected setButtonSelectedState(type: ButtonType, isSelected: boolean) {
        const button = this.buttonMap.get(type);
        if (button) button.isSelected = isSelected;
    }

    onResize(layoutSettings: LayoutSettings): void {
        this.recalculateLayout(layoutSettings);
    }

    protected recalculateLayout(layoutSettings: LayoutSettings) {
        if (!this.hudEntities) return;

        const width = layoutSettings.viewport.width;
        const height = layoutSettings.viewport.height;

        // 1. Buttons
        this.hudEntities.buttons.forEach(btn => {
            btn.layout = HUDLayoutService.getButtonLayout(btn.type, width, height);
        });

        // 2. Cards
        const totalCards = this.hudEntities.cards.length;
        this.hudEntities.cards.forEach((card, index) => {
            card.layout = HUDLayoutService.getHandCardLayout(index, totalCards, width, height);
        });

        // 3. Player Panels
        this.hudEntities.playerPanels.forEach((panel, index) => {
            panel.layout = HUDLayoutService.getPlayerPanelLayout(index, width, height);
        });
    }

    // --- Abstract / Overridable methods for child classes ---
    
    // Child classes implement this instead of onClick to avoid re-implementing button logic
    protected abstract onMapClick(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void;

    protected abstract onMapMouseMove(x: number, y: number, game: GameState, layoutSettings: LayoutSettings): void;

    protected updateHandCards(game: GameState, layoutSettings: LayoutSettings) {
        // Find local player
        const player = game.players.find(p => p.isLocal);
        if (!player) return;

        // Flatten resources into a list of cards
        const resources: ResourceType[] = [];
        Object.entries(player.inventory.resources).forEach(([res, count]) => {
            for (let i = 0; i < count; i++) {
                resources.push(res as ResourceType);
            }
        });

        // Generate Layouts
        this.hudEntities!.cards = resources.map((res, index) => {
            const layout = HUDLayoutService.getHandCardLayout(
                index,
                resources.length,
                layoutSettings.viewport.width,
                layoutSettings.viewport.height
            );

            return {
                resourceType: res,
                layout: layout,
                isHovered: false,
                isSelected: false
            };
        });
    }

    protected updatePlayerPanels(game: GameState, layoutSettings: LayoutSettings) {
        this.hudEntities!.playerPanels = game.players.map((player, index) => {
            const layout = HUDLayoutService.getPlayerPanelLayout(
                index,
                layoutSettings.viewport.width,
                layoutSettings.viewport.height
            );

            return {
                player: player,
                layout: layout
            };
        });
    }
}