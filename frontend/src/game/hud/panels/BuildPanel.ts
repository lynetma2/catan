// hud/panels/BuildPanel.ts
import { FrameQueue }           from '../../core/FrameQueue';
import { NormalizedInputEvent } from '../../types/InputEvent';
import { PieceType }            from '../../types/Player';
import { Rect }                 from '../../types/Rect';
import { Vec2 }                 from '../../types/Vec2';

export const BUILD_PANEL_BOUNDS: Rect = { x: 20, y: 20, width: 200, height: 260 };

const CARD_HEIGHT  = 52;
const CARD_SPACING = 8;
const CARD_OFFSET  = 44;

const PIECES: PieceType[] = ['road', 'settlement', 'city'];

export interface BuildPanelState {
    hoveredPiece:  PieceType | null;
    selectedPiece: PieceType | null;
}

export class BuildPanel {
    private state: BuildPanelState = {
        hoveredPiece:  null,
        selectedPiece: null,
    };

    constructor(private frameQueue: FrameQueue) {}

    handleInput(event: NormalizedInputEvent): boolean {
        if (event.type === 'mousemove') {
            this.state.hoveredPiece = this.pieceAtPos(event.screenPos);
            return this.state.hoveredPiece !== null;
        }

        if (event.type === 'click') {
            const piece = this.pieceAtPos(event.screenPos);
            if (!piece) return false;

            this.state.selectedPiece = piece;
            this.frameQueue.push({
                type: 'BUILD_MODE_ENTERED',
                payload: { pieceType: piece },
                source: 'hud'
            });
            return true;
        }

        if (event.type === 'keydown' && event.key === 'escape') {
            if (this.state.selectedPiece) {
                this.state.selectedPiece = null;
                this.frameQueue.push({
                    type: 'BUILD_MODE_EXITED',
                    payload: {},
                    source: 'hud'
                });
                return true;
            }
        }

        return false;
    }

    // Called by HUD when BUILD_MODE_EXITED comes back through the bus
    // e.g. world might cancel build mode on certain conditions
    clearSelection() {
        this.state.selectedPiece = null;
    }

    cardBounds(index: number): Rect {
        return {
            x:      BUILD_PANEL_BOUNDS.x + 8,
            y:      BUILD_PANEL_BOUNDS.y + CARD_OFFSET + index * (CARD_HEIGHT + CARD_SPACING),
            width:  BUILD_PANEL_BOUNDS.width - 16,
            height: CARD_HEIGHT,
        };
    }

    private pieceAtPos(pos: Vec2): PieceType | null {
        return PIECES.find((_, i) => this.containsPoint(this.cardBounds(i), pos)) ?? null;
    }

    private containsPoint(rect: Rect, pos: Vec2): boolean {
        return pos.x >= rect.x
            && pos.x <= rect.x + rect.width
            && pos.y >= rect.y
            && pos.y <= rect.y + rect.height;
    }

    getState(): Readonly<BuildPanelState> {
        return this.state;
    }
}