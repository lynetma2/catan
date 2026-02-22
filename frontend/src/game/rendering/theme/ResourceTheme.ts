
import woodIcon from '@/assets/resources/wood.svg';
import brickIcon from '@/assets/resources/brick.svg';
import stoneIcon from '@/assets/resources/stone.svg';
import wheatIcon from '@/assets/resources/wheat.svg';
import sheepIcon from '@/assets/resources/sheep.svg';
import {ResourceType} from "@/game/core/types.ts";

export interface ResourceStyle {
    fillColor: string;
    imageSrc: string;
    labelColor?: string;
    strokeColor?: string;
    iconColor?: string; // New property for dynamic coloring
    fontStyle?: string;
    iconHeightOffset?: number;
    iconScale?: number;
}

export const RESOURCE_STYLES: Record<ResourceType, ResourceStyle> = {
    [ResourceType.Lumber]: {
        fillColor: '#129639', // Dark Green
        imageSrc: woodIcon,
        iconColor: '#FFFFFF', // Example: Make the icon White
    },
    [ResourceType.Brick]: {
        fillColor: '#E06026', // Red/Brown
        imageSrc: brickIcon,
        iconColor: '#FFFFFF',
    },
    [ResourceType.Wool]: {
        fillColor: '#8EB50B', // Light Green
        imageSrc: sheepIcon,
        iconColor: '#FFFFFF',
    },
    [ResourceType.Grain]: {
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