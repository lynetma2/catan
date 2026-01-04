import {ResourceType, TileKind} from "@/game/model/enums.ts";

export interface TileStyle {
    fillColor: string;
    imageSrc: string;
    labelColor?: string;
    strokeColor?: string;
    fontStyle?: string;
    iconHeightOffset?: number;
    iconScale?: number;
}

// ---------------------------------------------------------

// config/Theme.ts
// This REPLACES your switch statement.
export const RESOURCE_STYLES: Record<ResourceType, TileStyle> = {
    [ResourceType.Wood]: {
        fillColor: '#129639', // Dark Green
        imageSrc: 'assets/wood.png',
    },
    [ResourceType.Brick]: {
        fillColor: '#E06026', // Red/Brown
        imageSrc: 'assets/brick.png',
    },
    [ResourceType.Sheep]: {
        fillColor: '#8EB50B', // Light Green
        imageSrc: 'assets/sheep.png',
    },
    [ResourceType.Wheat]: {
        fillColor: '#EFB516', // Yellow/Gold
        imageSrc: 'assets/wheat.png',
    },
    [ResourceType.Ore]: {
        fillColor: '#A2A8A4', // Grey
        imageSrc: 'assets/ore.png',
    }
};

export type FixedTileKind = Exclude<TileKind, TileKind.ResourceTile>;

export const FIXED_STYLES: Record<FixedTileKind, TileStyle> = {
    [TileKind.SeaTile]: {
        fillColor: '#00F', // Ocean Blue
        imageSrc: 'assets/sea.png'
    },
    [TileKind.DessertTile]: {
        fillColor: '#C8BF80', // Sand Color
        imageSrc: 'assets/desert.png'
    },
    [TileKind.PortTile]: {
        fillColor: '#00F', // Often same as sea, but maybe with a UI overlay
        imageSrc: 'assets/port.png'
    }
};