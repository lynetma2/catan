import {ResourceType, TileKind} from "@/game/model/enums.ts";

import woodIcon from '@/assets/resources/wood.svg';
import brickIcon from '@/assets/resources/brick.svg';
import stoneIcon from '@/assets/resources/stone.svg';
import wheatIcon from '@/assets/resources/wheat.svg';
import sheepIcon from '@/assets/resources/sheep.svg';

export interface TileStyle {
    fillColor: string;
    imageSrc: string;
    labelColor?: string;
    strokeColor?: string;
    iconColor?: string; // New property for dynamic coloring
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
        imageSrc: woodIcon,
        iconColor: '#FFFFFF', // Example: Make the icon White
    },
    [ResourceType.Brick]: {
        fillColor: '#E06026', // Red/Brown
        imageSrc: brickIcon,
        iconColor: '#FFFFFF',
    },
    [ResourceType.Sheep]: {
        fillColor: '#8EB50B', // Light Green
        imageSrc: sheepIcon,
        iconColor: '#FFFFFF',
    },
    [ResourceType.Wheat]: {
        fillColor: '#EFB516', // Yellow/Gold
        imageSrc: wheatIcon,
        iconColor: '#FFFFFF',
    },
    [ResourceType.Ore]: {
        fillColor: '#A2A8A4', // Grey
        imageSrc: stoneIcon,
        iconColor: '#FFFFFF',
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