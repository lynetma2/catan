import type {Rect} from "@/game/utils/Rect.ts";
import type {ResourceType} from "@/game/core/types.ts";

export interface ResourceCard {
    resourceType: ResourceType,
    uid: string,
    isHovered: boolean,
    isSelected: boolean,
    bounds: Rect;
}

export interface ResourcePanelState {
    bounds: Rect;
    resourceCards: ResourceCard[];
}
