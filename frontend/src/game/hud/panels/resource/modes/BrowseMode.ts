import {
    type BrowseModeState,
    type ResourcePanelMode,
    ResourcePanelModeKind,
} from "@/game/hud/panels/resource/types.ts";
import {InputType, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import type {FrameQueue} from "@/game/core/FrameQueue.ts";
import type {ResolutionManager} from "@/game/core/ResolutionManager.ts";
import type {SharedState} from "@/game/core/SharedState.ts";
import {resolveBrowseHandCards} from "@/game/hud/panels/resource/Layout/ResourceCardLayout.ts";
import {resolveHandPanelBounds} from "@/game/hud/panels/resource/Layout/ResourcePanelLayout.ts";
import {GameUiEventCreators} from "@/events/game/GameUiEvents.ts";
import type {GameEventMap} from "@/events/shared/AppEvents.ts";
import type {Rect} from "@/game/utils/Rect.ts";
import {DevelopmentCardType} from "@/game/core/types.ts";
import {GameActionEventCreators} from "@/events/game/GameActionEvents.ts";


export class BrowseMode implements ResourcePanelMode<BrowseModeState> {
    private readonly frameQueue: FrameQueue<GameEventMap>;
    private readonly resolution: ResolutionManager;
    private readonly sharedState: SharedState;
    private hoveredCardId: string | null = null;

    constructor(frameQueue: FrameQueue<GameEventMap>, resolution: ResolutionManager, sharedState: SharedState) {
        this.frameQueue = frameQueue;
        this.resolution = resolution;
        this.sharedState = sharedState;
    }

    onEnter(): void {
    }

    onExit(): void {
        this.hoveredCardId = null;
    }

    handleInput(event: NormalizedInputEvent): boolean {
        const r = this.resolution.get();
        const {resCards, devCards} = resolveBrowseHandCards(
            this.sharedState.localPlayerResources ?? [],
            this.sharedState.localPlayerDevCards ?? [],
            this.hoveredCardId,
            r,
        );

        // all cards for hit‑testing
        const allCards: { bounds: Rect; uid: string }[] = [
            ...devCards.map(d => ({bounds: d.bounds, uid: d.uid})),
            ...resCards.map(c => ({bounds: c.bounds, uid: c.uid})),
        ];

        if (event.type === InputType.MouseMove) {
            const hit = allCards.find(c => this.pointInRect(event.screenPos, c.bounds));
            this.hoveredCardId = hit?.uid ?? null;
            return hit != null;
        }

        if (event.type === InputType.MouseClick) {
            const hit = allCards.find(c => this.pointInRect(event.screenPos, c.bounds));
            if (!hit) return false;

            // 1. Check if it's a development card
            const devHit = devCards.find(d => d.uid === hit.uid);
            if (devHit) {
                this.handleDevCardClick(devHit.developmentType, devHit.uid);
                return true;
            }

            // 2. Otherwise it's a resource card – require trade permission
            if (!this.sharedState.canInitiateTrade) return false;

            const resourceHit = resCards.find(c => c.uid === hit.uid);
            if (!resourceHit) return false;

            this.frameQueue.push(GameUiEventCreators.tradeStart(resourceHit.uid));
            return true;
        }

        return false;
    }

    getState(): BrowseModeState {
        const r = this.resolution.get();
        const {resCards, devCards} = resolveBrowseHandCards(
            this.sharedState.localPlayerResources ?? [],
            this.sharedState.localPlayerDevCards ?? [],   // assumes this property exists
            this.hoveredCardId,
            r,
        );
        return {
            kind: ResourcePanelModeKind.Browse,
            hand: {
                bounds: resolveHandPanelBounds(r),
                resCards,
                devCards,
            },
            isAtDiscardRisk: this.sharedState.isAtDiscardRisk,
        };
    }

    private pointInRect(p: { x: number; y: number }, r: Rect): boolean {
        return p.x >= r.x && p.x <= r.x + r.width && p.y >= r.y && p.y <= r.y + r.height;
    }

    // ── Development card handlers (one per type) ──
    private handleDevCardClick(type: DevelopmentCardType, uid: string): void {
        switch (type) {
            case DevelopmentCardType.Knight:
                this.onKnightClicked(uid);
                break;
            case DevelopmentCardType.RoadBuilding:
                this.onRoadBuildingClicked(uid);
                break;
            case DevelopmentCardType.YearOfPlenty:
                this.onYearOfPlentyClicked(uid);
                break;
            case DevelopmentCardType.Monopoly:
                this.onMonopolyClicked(uid);
                break;
            case DevelopmentCardType.VictoryPoint:
                this.onVictoryPointClicked(uid);
                break;
        }
    }

    private onKnightClicked(uid: string): void {
        console.log(`Knight card clicked: ${uid}`);
        this.frameQueue.push(GameActionEventCreators.playKnight(uid));
        // future: send event or transition to knight flow
    }

    private onRoadBuildingClicked(uid: string): void {
        console.log(`Road Building card clicked: ${uid}`);
        this.frameQueue.push(GameActionEventCreators.playRoadBuilding(uid));
    }

    private onYearOfPlentyClicked(uid: string): void {
        console.log(`Year of Plenty card clicked: ${uid}`);
        this.frameQueue.push(GameUiEventCreators.resourceSelectionStart(2, uid));
    }

    private onMonopolyClicked(uid: string): void {
        console.log(`Monopoly card clicked: ${uid}`);
        this.frameQueue.push(GameUiEventCreators.resourceSelectionStart(1, uid));
    }

    private onVictoryPointClicked(uid: string): void {
        console.log(`Victory Point card clicked: ${uid}`);
        // note: victory points are typically not "played", but we log for now
    }
}