import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import {type Resource, ResourceType} from "@/game/core/types.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import {
    type HitResult,
    HitResultKind,
    type ResourceCard,
    type ResourcePanelMode,
    ResourcePanelModeKind,
    type ResourceSelectionState,
    TradeButtonType,
    TradePanelKind
} from "@/game/hud/panels/resource/types.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {findHitButton, findHitCard} from "@/game/hud/panels/resource/utils.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import {
    resolveResourceSelectionLayout,
    type ResourceSelectionLayout
} from "@/game/hud/panels/resource/Layout/ResourcePanelLayout.ts";
import {
    resolveResourceSelectionCards,
    type ResourceSelectionCards
} from "@/game/hud/panels/resource/Layout/ResourceCardLayout.ts";
import {GameUiEventCreators} from "@/events/game/GameUiEvents.ts";
import {GameActionEventCreators} from "@/events/game/GameActionEvents.ts";

export interface ResourceSelectionArgs {
    requiredCount: number;
    usedCardId: string;
}

export class ResourceSelectionMode implements ResourcePanelMode<ResourceSelectionState, ResourceSelectionArgs> {
    private readonly frameQueue: FrameQueue<GameEventMap>;
    private readonly resolution: ResolutionManager;
    private readonly sharedState: SharedState;

    private requiredCount: number = 1;
    private usedCardId: string;
    private selectedResources: Resource[] = [];
    private hoveredButton: TradeButtonType | null = null;
    private hoveredCardId: string | null = null;

    constructor(frameQueue: FrameQueue<GameEventMap>, resolution: ResolutionManager, sharedState: SharedState) {
        this.frameQueue = frameQueue;
        this.resolution = resolution;
        this.sharedState = sharedState;
    }

    onEnter(args: ResourceSelectionArgs) {
        this.requiredCount = args.requiredCount;
        this.selectedResources = [];
        this.hoveredButton = null;
        this.hoveredCardId = null;
        this.usedCardId = args.usedCardId;
    }

    onExit() {
        this.selectedResources = [];
        this.hoveredCardId = null;
        this.hoveredButton = null;
    }

    // ─── Input ────────────────────────────────────────────────────────────────
    handleInput(event: NormalizedInputEvent): boolean {
        const r = this.resolution.get();
        const layout = resolveResourceSelectionLayout(r);
        const isLimitReached = this.selectedResources.length >= this.requiredCount;

        const cards = resolveResourceSelectionCards(
            {[TradePanelKind.Wanted]: this.selectedResources},
            this.hoveredCardId,
            r,
            isLimitReached
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
    getState(): ResourceSelectionState {
        const r = this.resolution.get();
        const layout = resolveResourceSelectionLayout(r);
        const isLimitReached = this.selectedResources.length >= this.requiredCount;

        const cards = resolveResourceSelectionCards(
            {[TradePanelKind.Wanted]: this.selectedResources},
            this.hoveredCardId,
            r,
            isLimitReached
        );

        return {
            kind: ResourcePanelModeKind.ResourceSelection,
            requiredCount: this.requiredCount,
            [TradePanelKind.Selector]: {bounds: layout[TradePanelKind.Selector], cards: cards[TradePanelKind.Selector]},
            [TradePanelKind.Wanted]: {bounds: layout[TradePanelKind.Wanted], cards: cards[TradePanelKind.Wanted]},
            buttons: {
                cancel: layout[TradeButtonType.Cancel],
                confirmBank: layout[TradeButtonType.ConfirmBank],
            },
            hoveredButton: this.hoveredButton,
        };
    }

    // ─── Input position calculation ────────────────────────────────────────────
    private hitTestingGlobal(pos: Vec2, layout: ResourceSelectionLayout, cards: ResourceSelectionCards): HitResult {
        const buttons = {
            [TradeButtonType.Cancel]: layout[TradeButtonType.Cancel],
            [TradeButtonType.ConfirmBank]: layout[TradeButtonType.ConfirmBank],
        };

        // Check cards
        for (const [panelKind, panelCards] of Object.entries(cards) as [TradePanelKind, ResourceCard[]][]) {
            // Filter out disabled cards so they don't intercept clicks or show hover effects
            const activeCards = panelCards.filter(c => !c.isDisabled);
            const hit = findHitCard(activeCards, pos);
            if (hit != null) {
                return {
                    kind: HitResultKind.Card,
                    panelKind: panelKind,
                    uid: hit.uid,
                    resourceType: hit.resourceType
                };
            }
        }

        // Check buttons
        const hitButton = findHitButton(buttons, pos);
        if (hitButton != null) {
            return {kind: HitResultKind.Button, button: hitButton};
        }

        return {kind: HitResultKind.None};
    }

    // Click handlers
    private handleClick(pos: Vec2, layout: ResourceSelectionLayout, cards: ResourceSelectionCards): boolean {
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
                this.selectedResources = [];
                targetHit = true;
                // Ensure this matches your actual event creator name
                this.frameQueue.push(GameUiEventCreators.resourceSelectionCancel());
                console.log("cancelButtonHit", hit);
                break;
            }
            case TradeButtonType.ConfirmBank: {
                targetHit = true;
                if (this.selectedResources.length === this.requiredCount) {
                    const selectedTypes = this.selectedResources.map(res => res.resourceType);
                    // Ensure this matches your actual event creator name
                    if (this.requiredCount === 1) {
                        this.handleMonopolyClicked(selectedTypes);
                    } else if (this.requiredCount === 2) {
                        this.handleYearOfPlentyClicked(selectedTypes);
                    } else {
                        console.log("Error with the selected types amount!: ", selectedTypes);
                    }
                }
                break;
            }
        }

        return targetHit;
    }

    private handleCardClick(hit: Extract<HitResult, { kind: HitResultKind.Card }>): boolean {
        let targetHit = false;
        switch (hit.panelKind) {
            case TradePanelKind.Selector: {
                if (this.selectedResources.length < this.requiredCount) {
                    const newCard: Resource = {
                        uid: crypto.randomUUID(),
                        resourceType: hit.resourceType
                    };
                    this.selectedResources.push(newCard);
                }
                targetHit = true;
                break;
            }
            case TradePanelKind.Wanted: {
                this.removeCard(hit.uid, this.selectedResources);
                targetHit = true;
                break;
            }
        }
        return targetHit;
    }

    private removeCard(uid: string, from: Resource[]): void {
        const cardIndex = from.findIndex(card => card.uid === uid);
        if (cardIndex !== -1) {
            from.splice(cardIndex, 1);
        } else {
            console.warn(`Card with uid '${uid}' was not found in the source array.`);
        }
    }

    private handleMonopolyClicked(selectedTypes: ResourceType[]) {
        this.frameQueue.push(GameActionEventCreators.playMonopoly(this.usedCardId, selectedTypes[0]));
    }

    private handleYearOfPlentyClicked(selectedTypes: ResourceType[]) {
        this.frameQueue.push(GameActionEventCreators.playYearOfPlenty(this.usedCardId, selectedTypes[0], selectedTypes[1]));
    }
}