import {
    DiscardButtonType,
    type DiscardModeState,
    type ResourcePanelMode,
    ResourcePanelModeKind,
    TradePanelKind,
} from "@/game/hud/panels/resource/types.ts";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import type {Resource} from "@/game/core/types.ts";
import {resolveDiscardLayout} from "@/game/hud/panels/resource/Layout/ResourcePanelLayout.ts";
import {resolveHandCards} from "@/game/hud/panels/resource/Layout/ResourceCardLayout.ts";
import {findHitButton, findHitCard} from "@/game/hud/panels/resource/utils.ts";
import {GameActionEventCreators} from "@/events/game/GameActionEvents.ts";

export class DiscardMode implements ResourcePanelMode<DiscardModeState, number> {
    private readonly frameQueue: FrameQueue;
    private readonly resolution: ResolutionManager;
    private readonly sharedState: SharedState;
    private hoveredCardId: string | null = null;
    private hoveredButton: DiscardButtonType | null = null;
    private selectedCards: Set<string> = new Set();

    constructor(
        frameQueue: FrameQueue,
        resolution: ResolutionManager,
        sharedState: SharedState,
    ) {
        this.frameQueue = frameQueue;
        this.resolution = resolution;
        this.sharedState = sharedState;
    }

    private get hand(): Resource[] {
        return this.sharedState.localPlayerResources ?? [];
    }

    onEnter(): void {
    }

    onExit(): void {
        this.hoveredCardId = null;
        this.hoveredButton = null;
        this.selectedCards.clear();
    }

    handleInput(event: NormalizedInputEvent): boolean {
        const r = this.resolution.get();
        const layout = resolveDiscardLayout(r);
        const cards = resolveHandCards(this.hand, this.hoveredCardId, r);

        if (event.type === InputType.MouseMove) {
            const hitCard = findHitCard(cards, event.screenPos);
            const hitButton = findHitButton<DiscardButtonType>(layout, event.screenPos);

            this.hoveredCardId = hitCard?.uid ?? null;
            this.hoveredButton = hitButton;

            return hitCard != null || hitButton != null;
        }

        if (event.type === InputType.MouseClick) {
            const hitCard = findHitCard(cards, event.screenPos);

            if (hitCard != null) {
                this.toggleSelected(hitCard.uid);
                return true;
            }

            const hitButton = findHitButton<DiscardButtonType>(layout, event.screenPos);

            if (hitButton != null) {
                return this.handleButtonClick(hitButton);
            }
        }

        return false;
    }

    getState(): DiscardModeState {
        const r = this.resolution.get();
        const layout = resolveDiscardLayout(r);

        const cards = resolveHandCards(this.hand, this.hoveredCardId, r)
            .map(card => ({
                ...card,
                isSelected: this.selectedCards.has(card.uid),
            }));

        return {
            kind: ResourcePanelModeKind.Discard,
            hand: {
                bounds: layout[TradePanelKind.Hand],
                cards,
            },
            counter: layout.counter,
            amountSelected: this.selectedCards.size,
            mustDiscard: this.sharedState.discardCount,
            buttons: {
                confirm: layout[DiscardButtonType.Confirm],
                cancel: layout[DiscardButtonType.Cancel],
            },
            hoveredButton: this.hoveredButton,
        };
    }

    private toggleSelected(uid: string): void {
        if (this.selectedCards.has(uid)) {
            this.selectedCards.delete(uid);
        } else {
            this.selectedCards.add(uid);
        }
    }

    private handleButtonClick(button: DiscardButtonType): boolean {
        switch (button) {
            case DiscardButtonType.Confirm: {
                if (this.selectedCards.size !== this.sharedState.discardCount) {
                    return true;
                }

                const discarded = this.hand.filter(r =>
                    this.selectedCards.has(r.uid),
                );

                const ids = discarded.map(d => d.uid);
                this.frameQueue.push(GameActionEventCreators.discard(ids));

                return true;
            }

            case DiscardButtonType.Cancel: {
                this.selectedCards.clear();
                return true;
            }
        }
    }
}