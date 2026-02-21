// hud/panels/BuildPanel.ts
import { type FrameQueue }           from '@/game/core/FrameQueue';
import { type SharedState }          from '@/game/core/SharedState';
import { type NormalizedInputEvent } from '@/game/core/Input/InputEvent';
import { type Rect }                 from '@/game/utils/Rect';
import { type Vec2 }                 from '@/game/utils/Vec2';
import { containsPoint }             from '@/game/utils/Rect';
import { ButtonType }                from '@/game/hud/types';

export const BUILD_PANEL_BOUNDS: Rect = { x: 20, y: 20, width: 200, height: 260 };

const CARD_HEIGHT  = 52;
const CARD_SPACING = 8;
const CARD_OFFSET  = 44;

export interface Button {
    type:       ButtonType;
    bounds:     Rect;
    isHovered:  boolean;
    isSelected: boolean;
    isDisabled: boolean;
    isHidden:   boolean;
}

export interface BuildPanelState {
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
            const state = this.resolveButton(button, ALL_BUTTONS.indexOf(button));
            if (state.isHidden || state.isDisabled) return false;

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
        return {
            buttons: ALL_BUTTONS
                .map((type, i) => this.resolveButton(type, i))
                .filter(b => !b.isHidden)  // renderer never sees hidden buttons
        };
    }

    // Derives the full button state from stored interaction state + SharedState
    private resolveButton(type: ButtonType, index: number): Button {
        const isMyTurn  = this.sharedState.isLocalPlayersTurn;
        const isHidden  = this.isButtonHidden(type, isMyTurn);
        const isDisabled = this.isButtonDisabled(type, isMyTurn);

        return {
            type,
            bounds:     this.cardBounds(index),
            isHovered:  this.hoveredButton  === type,
            isSelected: this.selectedButton === type,
            isDisabled,
            isHidden,
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

    private cardBounds(index: number): Rect {
        return {
            x:      BUILD_PANEL_BOUNDS.x + 8,
            y:      BUILD_PANEL_BOUNDS.y + CARD_OFFSET + index * (CARD_HEIGHT + CARD_SPACING),
            width:  BUILD_PANEL_BOUNDS.width - 16,
            height: CARD_HEIGHT,
        };
    }

    private buttonAtPos(pos: Vec2): ButtonType | null {
        return ALL_BUTTONS.find((_, i) => containsPoint(this.cardBounds(i), pos)) ?? null;
    }
}