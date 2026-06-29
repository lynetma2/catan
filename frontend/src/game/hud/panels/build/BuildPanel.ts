// hud/panels/build/BuildPanel.ts
import {ButtonType} from "@/game/hud/types.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import {GameKey, InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import type {BuildPanelState} from "@/game/hud/panels/build/types.ts";
import {BUTTON_CONFIGS, derivePanelBounds, hudLayout} from "@/game/hud/HudLayout.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import {containsPoint} from "@/game/utils/Rect.ts";
import {PieceType, GamePhase} from "@/game/core/types.ts";
import type {EventBus} from "@/game/core/EventBus";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {GameUiEvents} from "@/events/game/GameUiEvents.ts";
import {GameServerEvents} from "@/events/game/GameServerEvents.ts";
import {GameActionEvents} from "@/events/game/GameActionEvents.ts";

const ALL_BUTTONS: ButtonType[] = [
    ButtonType.putRoad,
    ButtonType.putSettlement,
    ButtonType.putCity,
    ButtonType.drawDevelopmentCard,
    ButtonType.endTurn,
    ButtonType.waiting
];

export class BuildPanel {
    private hoveredButton:  ButtonType | null = null;
    private selectedButton: ButtonType | null = null;

    constructor(
        private readonly frameQueue: FrameQueue<GameEventMap>,
        private readonly sharedState: SharedState,
        private readonly resolution: ResolutionManager,
        private readonly bus: EventBus<GameEventMap>,
    ) {
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        // Exit build mode (regardless of source) → clear selection
        this.bus.on(GameUiEvents.build.exit, () => this.clearSelection());
        // Piece placed on board (server confirms) → clear selection
        this.bus.on(GameServerEvents.build.settlement.success, () => this.clearSelection());
    }

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type === InputType.MouseMove) {
            this.hoveredButton = this.buttonAtPos(event.screenPos);
            return this.hoveredButton !== null;
        }

        if (event.type === InputType.MouseClick) {
            const button = this.buttonAtPos(event.screenPos);
            if (!button) return false;

            const isMyTurn = this.sharedState.isLocalPlayersTurn;
            if (this.isButtonHidden(button, isMyTurn))   return false;
            if (this.isButtonDisabled(button, isMyTurn)) return false;

            this.handleButtonClick(button);
            return true;
        }

        if (event.type === InputType.KeyDown && event.key === GameKey.Escape) {
            if (this.selectedButton) {
                this.clearSelection();
                this.exitBuildMode();
                return true;
            }
        }

        if (event.type === InputType.MouseLeave) {
            this.hoveredButton = null;
            return false;
        }

        return false;
    }

    private handleButtonClick(button: ButtonType) {
        switch (button) {
            case ButtonType.putRoad:
                this.handleBuildMode(button, PieceType.Road);
                break;
            case ButtonType.putSettlement:
                this.handleBuildMode(button, PieceType.Settlement);
                break;
            case ButtonType.putCity:
                this.handleBuildMode(button, PieceType.City);
                break;

            case ButtonType.drawDevelopmentCard:
                this.selectedButton = button;
                this.frameQueue.push({
                    type: GameActionEvents.developmentCard.draw,
                    payload: {},
                });
                break;

            case ButtonType.endTurn:
                this.frameQueue.push({
                    type: GameActionEvents.turn.end,
                    payload: {},
                });
                break;
        }
    }

    clearSelection() {
        this.selectedButton = null;
    }

    // ─── State ────────────────────────────────────────────────────────

    getState(): BuildPanelState {
        const isMyTurn = this.sharedState.isLocalPlayersTurn;
        const r        = this.resolution.get();

        const buttons = ALL_BUTTONS
            .map(type => ({
                type,
                bounds:     hudLayout.resolveFixed(BUTTON_CONFIGS[type], r),
                isHovered:  this.hoveredButton  === type,
                isSelected: this.selectedButton === type,
                isDisabled: this.isButtonDisabled(type, isMyTurn),
                isHidden:   this.isButtonHidden(type, isMyTurn),
            }))
            .filter(b => !b.isHidden);

        return {
            buttons,
            bounds: derivePanelBounds(buttons),
        };
    }

    private isButtonHidden(type: ButtonType, isMyTurn: boolean): boolean {
        switch (type) {
            case ButtonType.waiting:
                return isMyTurn;
            case ButtonType.endTurn:
                return !isMyTurn;
            default:                 return false;
        }
    }

    private isButtonDisabled(type: ButtonType, isMyTurn: boolean): boolean {
        if (!isMyTurn) return true;

        const phase = this.sharedState.currentPhase;

        switch (type) {
            case ButtonType.putRoad:
                if (phase === GamePhase.SetupPlaceRoad) return false;
                if (phase === GamePhase.PostRoll) return !this.sharedState.canAfford(PieceType.Road);
                return true;

            case ButtonType.putSettlement:
                if (phase === GamePhase.SetupPlaceSettlement) return false;
                if (phase === GamePhase.PostRoll) return !this.sharedState.canAfford(PieceType.Settlement);
                return true;

            case ButtonType.putCity:
                if (phase === GamePhase.PostRoll) return !this.sharedState.canAfford(PieceType.City);
                return true;

            case ButtonType.drawDevelopmentCard:
                if (phase === GamePhase.PostRoll) return !this.sharedState.canAffordDevCard();
                return true;

            case ButtonType.endTurn:
                return phase !== GamePhase.PostRoll;

            case ButtonType.waiting:
                return true;

            default:
                return false;
        }
    }

    private buttonAtPos(pos: Vec2): ButtonType | null {
        const r = this.resolution.get();
        return ALL_BUTTONS.find(type => {
            if (this.isButtonHidden(type, this.sharedState.isLocalPlayersTurn)) return false;
            return containsPoint(hudLayout.resolveFixed(BUTTON_CONFIGS[type], r), pos);
        }) ?? null;
    }

    private handleBuildMode(button: ButtonType, pieceType: PieceType) {
        if (this.selectedButton === button) {
            this.clearSelection();
            this.exitBuildMode();
        } else {
            if (!this.sharedState.canAfford(pieceType)) return;
            this.selectedButton = button;
            this.enterBuildMode(pieceType);
        }
    }

    private enterBuildMode(pieceType: PieceType) {
        this.frameQueue.push({
            type: GameUiEvents.build.enter,
            payload: {pieceType},
        });
    }

    private exitBuildMode() {
        this.frameQueue.push({
            type: GameUiEvents.build.exit,
            payload: {},
        });
    }
}