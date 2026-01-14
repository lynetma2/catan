import {BaseGameState} from "@/game/state/BaseGameState.ts";
import type {Button, GameState, LayoutSettings} from "@/game/model/types.ts";
import {ActionValidator} from "@/game/logic/ActionValidator.ts";
import {ButtonType, ResourceType} from "@/game/model/enums.ts";
import {HUDLayoutService} from "@/game/layout/HUDLayoutService.ts";

export abstract class GameplayState extends BaseGameState {

    protected generateButtons(game: GameState) {
        const localPlayer = game.players.find(p => p.isLocal);
        if (localPlayer) {
            const buttons: Button[] = [];
            const buttonStates = ActionValidator.getButtonStates(game, localPlayer.playerName);

            buttonStates.forEach(state => {
                const btn = this.createButton(state.type);
                btn.isDisabled = state.isDisabled;
                buttons.push(btn);
            });

            this.hudEntities!.buttons = buttons;
        }
    }

    protected updateButtonStates(game: GameState) {
        const localPlayer = game.players.find(p => p.isLocal);
        if (!localPlayer || !this.hudEntities) return;

        const buttonStates = ActionValidator.getButtonStates(game, localPlayer.playerName);
        const stateMap = new Map(buttonStates.map(s => [s.type, s.isDisabled]));

        this.hudEntities.buttons.forEach(btn => {
            if (stateMap.has(btn.type)) {
                btn.isDisabled = stateMap.get(btn.type);
            }
        });
    }

    protected updateHandCards(game: GameState, layoutSettings: LayoutSettings) {
        // Find local player
        const player = game.players.find(p => p.isLocal);
        if (!player) return;

        // Flatten resources into a list of cards
        const resources: ResourceType[] = [];

        // Use deterministic order (Enum values) to prevent cards jumping around
        Object.values(ResourceType).forEach(res => {
            const count = player.inventory.resources[res] || 0;
            for (let i = 0; i < count; i++) {
                resources.push(res);
            }
        });

        const oldCards = this.hudEntities?.cards || [];

        // Generate Layouts
        this.hudEntities!.cards = resources.map((res, index) => {
            const layout = HUDLayoutService.getHandCardLayout(
                index,
                resources.length,
                layoutSettings.viewport.width,
                layoutSettings.viewport.height
            );

            // Preserve state from previous frame
            let isHovered = false;
            let isSelected = false;

            if (index < oldCards.length) {
                const oldCard = oldCards[index];
                // Only preserve if the card type hasn't changed at this index
                if (oldCard.resourceType === res) {
                    isHovered = oldCard.isHovered;
                    isSelected = oldCard.isSelected;
                }
            }

            return {
                resourceType: res,
                layout: layout,
                isHovered: isHovered,
                isSelected: isSelected
            };
        });
    }

    protected updatePlayerPanels(game: GameState, layoutSettings: LayoutSettings) {
        this.hudEntities!.playerPanels = game.players.map((player, index) => {
            return {
                player: player,
                layout: HUDLayoutService.getPlayerPanelLayout(index, layoutSettings.viewport.width, layoutSettings.viewport.height)
            };
        });
    }
}