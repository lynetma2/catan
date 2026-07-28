import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import type {Resource} from "@/game/core/types.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import {resolveTradeLayout, type TradeLayout} from "@/game/hud/panels/resource/Layout/ResourcePanelLayout.ts";
import {resolveTradeCards, type TradeCards} from "@/game/hud/panels/resource/Layout/ResourceCardLayout.ts";
import {
    type HitResult,
    HitResultKind,
    type ResourceCard,
    type ResourcePanelMode,
    ResourcePanelModeKind,
    TradeButtonType,
    type TradeModeState,
    TradePanelKind
} from "@/game/hud/panels/resource/types.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {findHitButton, findHitCard} from "@/game/hud/panels/resource/utils.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {GameUiEventCreators} from "@/events/game/GameUiEvents.ts";
import {GameActionEventCreators} from "@/events/game/GameActionEvents.ts";

export class TradeMode implements ResourcePanelMode<TradeModeState, string> {
    private readonly frameQueue: FrameQueue<GameEventMap>;
    private readonly resolution: ResolutionManager;
    private readonly sharedState: SharedState;
    private hand: Resource[] = [];
    private wantedResources: Resource[] = [];
    private offeredResources: Resource[] = [];
    private hoveredButton: TradeButtonType | null = null;
    private hoveredCardId: string | null = null;

    constructor(frameQueue: FrameQueue<GameEventMap>, resolution: ResolutionManager, sharedState: SharedState) {
        this.frameQueue = frameQueue;
        this.resolution = resolution;
        this.sharedState = sharedState;
    }

    onEnter(initialCardUid: string) {
        this.hand = [...(this.sharedState.localPlayerResources ?? [])];
        if (initialCardUid) {
            this.moveCard(initialCardUid, this.hand, this.offeredResources);
        }
    }

    onExit() {
        this.wantedResources = [];
        this.offeredResources = [];
        this.hand = [];
        this.hoveredCardId = null;
        this.hoveredButton = null;
    }

    // ─── Input ────────────────────────────────────────────────────────────────
    handleInput(event: NormalizedInputEvent): boolean {
        const r = this.resolution.get();
        const layout = resolveTradeLayout(r);
        const cards = resolveTradeCards(
            {
                [TradePanelKind.Hand]: this.hand,
                [TradePanelKind.Offered]: this.offeredResources,
                [TradePanelKind.Wanted]: this.wantedResources
            },
            this.hoveredCardId,
            r,
        );

        if (event.type === InputType.MouseMove) {
            const hit = this.hitTestingGlobal(event.screenPos, layout, cards);

            switch (hit.kind) {
                case HitResultKind.None:
                    this.hoveredCardId = null;
                    this.hoveredButton = null;
                    break;
                case HitResultKind.Card:
                    this.hoveredCardId = hit.uid;
                    this.hoveredButton = null;
                    break;
                case HitResultKind.Button:
                    this.hoveredButton = hit.button;
                    this.hoveredCardId = null;
                    break;
            }
        }

        if (event.type === InputType.MouseClick) {
            return this.handleClick(event.screenPos, layout, cards);
        }
        return false;
    }

    // ─── State ────────────────────────────────────────────────────────────────
    getState(): TradeModeState {
        const r = this.resolution.get();
        const layout = resolveTradeLayout(r);
        const cards = resolveTradeCards({
                [TradePanelKind.Hand]: this.hand,
                [TradePanelKind.Offered]: this.offeredResources,
                [TradePanelKind.Wanted]: this.wantedResources
            },
            this.hoveredCardId,
            r
        );

        return {
            kind: ResourcePanelModeKind.Trade,
            [TradePanelKind.Hand]: {bounds: layout[TradePanelKind.Hand], cards: cards[TradePanelKind.Hand]},
            [TradePanelKind.Offered]: {bounds: layout[TradePanelKind.Offered], cards: cards[TradePanelKind.Offered]},
            [TradePanelKind.Wanted]: {bounds: layout[TradePanelKind.Wanted], cards: cards[TradePanelKind.Wanted]},
            [TradePanelKind.Selector]: {bounds: layout[TradePanelKind.Selector], cards: cards[TradePanelKind.Selector]},
            buttons: {
                cancel: layout[TradeButtonType.Cancel],
                confirmGlobal: layout[TradeButtonType.ConfirmPublic],
                confirmBank: layout[TradeButtonType.ConfirmBank],
            },
            hoveredButton: this.hoveredButton,
        }
    }


    // ─── Input position calculation ────────────────────────────────────────────


    private hitTestingGlobal(pos: Vec2, layout: TradeLayout, cards: TradeCards): HitResult {
        const buttons = {
            [TradeButtonType.Cancel]: layout[TradeButtonType.Cancel],
            [TradeButtonType.ConfirmPublic]: layout[TradeButtonType.ConfirmPublic],
            [TradeButtonType.ConfirmBank]: layout[TradeButtonType.ConfirmBank],
        };

        //Check cards.
        for (const [panelKind, card] of Object.entries(cards) as [TradePanelKind, ResourceCard[]][]) {
            const hit = findHitCard(card, pos);
            if (hit != null) {
                return {
                    kind: HitResultKind.Card,
                    panelKind: panelKind,
                    uid: hit.uid,
                    resourceType: hit.resourceType
                };
            }
        }

        //Check butttons
        const hitButton = findHitButton(buttons, pos);
        if (hitButton != null) {
            return {kind: HitResultKind.Button, button: hitButton};
        }

        return {kind: HitResultKind.None};
    }

    // Click handlers
    private handleClick(pos: Vec2, layout: TradeLayout, cards: TradeCards): boolean {
        const hit = this.hitTestingGlobal(pos, layout, cards);

        switch (hit.kind) {
            case HitResultKind.Card:
                return this.handleCardClick(hit);
            case HitResultKind.Button:
                return this.handleButtonClick(hit);
            case HitResultKind.None:
                return false;
        }
    }

    private handleButtonClick(hit: Extract<HitResult, { kind: HitResultKind.Button }>): boolean {
        let targetHit = false;
        switch (hit.button) {
            case TradeButtonType.Cancel: {
                this.resetArrays();
                targetHit = true;
                this.frameQueue.push(GameUiEventCreators.tradeCancel());
                break;
            }
            case TradeButtonType.ConfirmPublic: {
                const wantedTypes = this.wantedResources.map(wantedResource => wantedResource.resourceType);
                this.frameQueue.push(GameActionEventCreators.startPublicTrade(this.offeredResources, wantedTypes));
                targetHit = true;
                break;
            }
            case TradeButtonType.ConfirmBank: {
                const wantedTypes = this.wantedResources.map(wantedResource => wantedResource.resourceType);
                this.frameQueue.push(GameActionEventCreators.bankTrade(this.offeredResources, wantedTypes))
                targetHit = true;
                break;
            }
        }

        return targetHit;
    }

    private handleCardClick(hit: Extract<HitResult, { kind: HitResultKind.Card }>): boolean {
        let targetHit = false;
        switch (hit.panelKind) {
            case TradePanelKind.Hand: {
                this.moveCard(hit.uid, this.hand, this.offeredResources);
                targetHit = true;
                break;
            }
            case TradePanelKind.Offered: {
                this.moveCard(hit.uid, this.offeredResources, this.hand);
                targetHit = true;
                break;
            }
            case TradePanelKind.Wanted: {
                this.removeCard(hit.uid, this.wantedResources);
                targetHit = true;
                break;
            }
            case TradePanelKind.Selector: {
                const newCard: Resource = {
                    uid: crypto.randomUUID(),
                    resourceType: hit.resourceType
                }
                this.wantedResources.push(newCard);
                targetHit = true;
                break;
            }
        }
        return targetHit;
    }

    private moveCard(uid: string, from: Resource[], to: Resource[]): void {
        const cardIndex = from.findIndex(card => card.uid === uid);

        if (cardIndex !== -1) {
            const [cardToMove] = from.splice(cardIndex, 1);
            to.push(cardToMove);
        } else {
            console.warn(`Card with uid '${uid}' was not found in the source array.`);
        }
    }

    private removeCard(uid: string, from: Resource[]): void {
        const cardIndex = from.findIndex(card => card.uid === uid);
        if (cardIndex !== -1) {
            from.splice(cardIndex, 1);
        } else {
            console.warn(`Card with uid '${uid}' was not found in the source array.`);
        }
    }

    private resetArrays(): void {
        this.wantedResources = [];
        this.hand.push(...this.offeredResources);
        this.offeredResources = [];
    }

    // Keyboard handlers
}