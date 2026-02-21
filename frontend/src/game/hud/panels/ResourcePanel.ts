// hud/panels/ResourcePanel.ts
import { type SharedState }          from '@/game/core/SharedState';
import { type NormalizedInputEvent } from '@/game/types/InputEvent';

export interface ResourcePanelState {
    visible: boolean;
}

export class ResourcePanel {
    private state: ResourcePanelState = {
        visible: true,
    };

    constructor(private readonly shared: SharedState) {}

    handleInput(_event: NormalizedInputEvent): boolean {
        return false; // display-only for now
    }

    getState(): Readonly<ResourcePanelState> {
        return this.state;
    }
}