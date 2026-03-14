// hud/panels/resource/modes/TradeMode.ts
import type { ResourcePanel }             from "../ResourcePanel";
import { ResourcePanelModeKind,
    type ResourcePanelMode,
    type TradeModeState,
    type PanelHit }                 from "../types";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent";
import { GameEventSource, GameEventType } from "@/game/events/GameEventTypes";
import type { Resource, ResourceType }    from "@/game/core/types";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {ButtonType} from "@/game/hud/types.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import {resolveTradeLayout, type TradeLayout} from "@/game/hud/panels/resource2/Layout/ResourcePanelLayout.ts";
import {resolveTradeCards, type TradeCards} from "@/game/hud/panels/resource2/Layout/ResourceCardLayout.ts";
import type {ResourceCard} from "@/game/hud/panels/resource/types.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import {containsPoint, type Rect} from "@/game/utils/Rect.ts";
import type {TradeButtonType} from "@/game/hud/panels/resource2/types.ts";

export class TradeMode {
    private readonly frameQueue: FrameQueue;
    private readonly resolution: ResolutionManager;
    private hand: Resource[] = [];
    private wantedResources: Resource[] = [];
    private offeredResources: Resource[] = [];
    private hoveredButton: TradeButtonType | null = null; //TODO change to tradeButtons.
    private hoveredCardId: string | null = null;
    //TODO add the buttons.

    constructor(frameQueue: FrameQueue, resolution: ResolutionManager) {
        this.frameQueue = frameQueue;
        this.resolution = resolution;
    }

    onEnter(initialHand: Resource[]) {
        this.hand = initialHand;
    }

    onExit() {
        this.wantedResources = [];
        this.offeredResources = [];
        this.hand = [];
    }

    // ─── Input ────────────────────────────────────────────────────────────────
    handleInput(event: NormalizedInputEvent): boolean {
        const r = this.resolution.get();
        const layout = resolveTradeLayout(r);
        const cards  = resolveTradeCards(
            { hand: this.hand, offered: this.offeredResources, wanted: this.wantedResources },
            this.hoveredCardId,
            r,
        );
        return false;
    }

    // ─── State ────────────────────────────────────────────────────────────────
    getState() {
        const r = this.resolution.get();
        const layout = resolveTradeLayout(r);
        const cards = resolveTradeCards({
            hand: this.hand,
            offered: this.offeredResources,
            wanted: this.wantedResources
        },
            this.hoveredCardId,
            r
        );

        return {
            hand:     { bounds: layout.hand,     cards: cards.hand     },
            offered:  { bounds: layout.offer,    cards: cards.offered  },
            wanted:   { bounds: layout.wanted,   cards: cards.wanted   },
            selector: { bounds: layout.selector, cards: cards.selector },
            buttons: {
                cancel:        layout.cancelButton,
                confirmGlobal: layout.confirmGlobalButton,
                confirmBank:   layout.confirmBankButton,
            },
            hoveredButton: this.hoveredButton,
        }
    }


    // ─── Input position calculation ────────────────────────────────────────────
    private findHitCard(
        cards: ResourceCard[],
        pos:   Vec2,
    ): ResourceCard | null {
        for (let i = cards.length - 1; i >= 0; i--) {
            if (containsPoint(cards[i].bounds, pos)) return cards[i];
        }
        return null;
    }

    private findHitButton(
        buttons: Record<TradeButtonType, Rect>,
        pos:     Vec2,
    ): TradeButtonType | null {
        for (const [type, rect] of Object.entries(buttons)) {
            if (containsPoint(rect, pos)) return type as TradeButtonType;
        }
        return null;
    }

    // Hover handlers
    private handleMouseMove(event: Extract<NormalizedInputEvent, { type: InputType.MouseMove }>, layout: TradeLayout, cards: TradeCards) {
        const pos = event.screenPos;

        //Check cards.
        for (const [key, panel] of Object.entries(cards)) {
            const hit = this.findHitCard(panel, pos);
            if (hit != null) {
                this.hoveredCardId = hit.uid;
                return;
            }
        }

        //TODO check the butttons.
    }

    // Click handlers

    // Keyboard handlers
}