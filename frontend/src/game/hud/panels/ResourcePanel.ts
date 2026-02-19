// hud/panels/ResourcePanel.ts
import { SharedState }   from '../../core/SharedState';
import { NormalizedInputEvent } from '../../types/InputEvent';
import { Rect }          from '../../types/Rect';

export const RESOURCE_PANEL_BOUNDS: Rect = { x: 20, y: 300, width: 200, height: 180 };

export class ResourcePanel {
    constructor(private shared: SharedState) {}

    handleInput(_event: NormalizedInputEvent): boolean {
        // Resource panel is display-only for now
        return false;
    }
}