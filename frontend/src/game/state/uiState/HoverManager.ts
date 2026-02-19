import type {HoverLayerInterface} from "@/game/state/uiState/layers/HoverLayerInterface.ts";
import type {GhostEffect, Point} from "@/game/model/types.ts";

export interface HoverManagerInterface {
    // Register a layer
    addLayer(layer: HoverLayerInterface, priority: number): void;
    removeLayer(layer: HoverLayerInterface): void;

    enableLayer(layerType: string): void;
    disableLayer(layerType: string): void;

    onMouseMove(worldPos: Point): void;
    onClick(worldPos: Point): void;

    getAllGhostEffects(): GhostEffect[];
    getActiveHoverEffect(): HoverLayerInterface;
}

export interface LayerEntry {
    layer: HoverLayerInterface;
    priority: number;
    enabled: boolean;
}

export class HoverManager implements HoverManagerInterface {
    private layers: LayerEntry[] = [];

    addLayer(layer: HoverLayerInterface, priority: number): void {
        this.layers.push({layer, priority, enabled: true});

        //Sort to keep it in order correctly
        this.layers.sort((a, b) => b.priority - a.priority);
    }

    disableLayer(layerType: string): void {
        for (const entry of this.layers) {
            if (entry.layer.layerType === layerType) {
                entry.enabled = false;
            }
        }
    }

    enableLayer(layerType: string): void {
        for (const entry of this.layers) {
            if (entry.layer.layerType === layerType) {
                entry.enabled = true;
            }
        }
    }

    getActiveHoverEffect(): HoverLayerInterface {
        for (const entry of this.layers) {
            if (entry.enabled) {
                entry.layer.
            }
        }
        return undefined;
    }

    getAllGhostEffects(): GhostEffect[] {
        return [];
    }

    onClick(worldPos: Point): void {
    }

    onMouseMove(worldPos: Point): void {
    }

    removeLayer(layer: HoverLayerInterface): void {
    }

}