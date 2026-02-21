// hud/panels/BuildPanel.ts
import { type FrameQueue }           from '@/game/core/FrameQueue';
import { type SharedState }          from '@/game/core/SharedState';
import { type NormalizedInputEvent } from '@/game/core/Input/InputEvent';
import { type Rect }                 from '@/game/utils/Rect';
import { type Vec2 }                 from '@/game/utils/Vec2';
import { containsPoint }             from '@/game/utils/Rect';
import {ButtonType} from '@/game/hud/types';
import {BUTTON_CONFIGS, derivePanelBounds, hudLayout, type PanelConfig} from "@/game/hud/HudLayout.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";

export interface Button {
    type:       ButtonType;
    bounds:     Rect;
    isHovered:  boolean;
    isSelected: boolean;
    isDisabled: boolean;
    isHidden:   boolean;
}

export interface BuildPanelState {
    bounds: Rect;
    buttons: Button[];
}

// The buttons that always exist — visibility/disabled derived at runtime
const ALL_BUTTONS: ButtonType[] = [
    ButtonType.putRoad,
    ButtonType.putSettlement,
    ButtonType.putCity,
    ButtonType.drawDevelopmentCard,
    ButtonType.endTurn,
    ButtonType.waiting,
];

export class BuildPanel {
    // Only the interactive state is stored — visibility is derived
    private hoveredButton:  ButtonType | null = null;
    private selectedButton: ButtonType | null = null;

    constructor(
        private readonly frameQueue:   FrameQueue,
        private readonly sharedState:  SharedState,
        private readonly resolution:   ResolutionManager,
    ) {}

    // ─── Input ────────────────────────────────────────────────────────

    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type === 'mousemove') {
            this.hoveredButton = this.buttonAtPos(event.screenPos);
            return this.hoveredButton !== null;
        }

        if (event.type === 'click') {
            const button = this.buttonAtPos(event.screenPos);
            if (!button) return false;

            // Don't act on hidden or disabled buttons
            const isMyTurn = this.sharedState.isLocalPlayersTurn;
            if (this.isButtonHidden(button, isMyTurn))   return false;
            if (this.isButtonDisabled(button, isMyTurn)) return false;

            this.handleButtonClick(button);
            return true;
        }

        if (event.type === 'keydown' && event.key === 'escape') {
            if (this.selectedButton) {
                this.clearSelection();
                this.frameQueue.push({
                    type:    'BUILD_MODE_EXITED',
                    payload: {},
                    source:  'hud'
                });
                return true;
            }
        }

        return false;
    }

    private handleButtonClick(button: ButtonType) {
        switch (button) {
            case ButtonType.putRoad:
            case ButtonType.putSettlement:
            case ButtonType.putCity:
            case ButtonType.drawDevelopmentCard:
                this.selectedButton = button;
                this.frameQueue.push({
                    type:    'BUILD_MODE_ENTERED',
                    payload: { pieceType: button },
                    source:  'hud'
                });
                break;

            case ButtonType.endTurn:
                this.frameQueue.push({
                    type:    'END_TURN_REQUESTED',
                    payload: {},
                    source:  'hud'
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

        console.log("Current State: ", {
            buttons: buttons,
            bounds: derivePanelBounds(buttons),
        });

        return {
            buttons: buttons,
            bounds: derivePanelBounds(buttons),  // ← derived, not configured
        };
    }

    private isButtonHidden(type: ButtonType, isMyTurn: boolean): boolean {
        switch (type) {
            case ButtonType.waiting: return isMyTurn;   // hide waiting when it's your turn
            case ButtonType.endTurn: return !isMyTurn;  // hide end turn when it's not
            default:                 return false;
        }
    }

    private isButtonDisabled(type: ButtonType, isMyTurn: boolean): boolean {
        switch (type) {
            case ButtonType.putRoad:
            case ButtonType.putSettlement:
            case ButtonType.putCity:
            case ButtonType.drawDevelopmentCard:
            case ButtonType.endTurn:
                return !isMyTurn;  // all action buttons disabled when not your turn
            case ButtonType.waiting:
                return true;       // waiting button is always non-interactive
            default:
                return false;
        }
    }

    private buttonAtPos(pos: Vec2): ButtonType | null {
        const r = this.resolution.get();
        return ALL_BUTTONS.find(type => {
            if (this.isButtonHidden(type, this.sharedState.isLocalPlayersTurn)) return false;
            return containsPoint(hudLayout.resolve(BUTTON_CONFIGS[type], r), pos);
        }) ?? null;
    }
}