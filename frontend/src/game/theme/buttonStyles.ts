import {ButtonType} from "@/game/model/enums.ts";

import woodIcon from '@/assets/resources/wood.svg';
import brickIcon from '@/assets/resources/brick.svg';
import stoneIcon from '@/assets/resources/stone.svg';
import wheatIcon from '@/assets/resources/wheat.svg';
import sheepIcon from '@/assets/resources/sheep.svg';

export interface ButtonStyle {
    fillColor: string;
    imageSrc: string;
    strokeColor?: string;
    iconColor?: string; // New property for dynamic coloring
    iconHeightOffset?: number;
    iconScale?: number;
}

export const BUTTON_STYLES: Record<ButtonType, ButtonStyle> = {
    [ButtonType.drawDevelopmentCard]: {
        fillColor: '#FFF', // Dark Green
        imageSrc: woodIcon,
        iconColor: '#FFFFFF', // Example: Make the icon White
    },
    [ButtonType.endTurn]: {
        fillColor: '#E06026', // Red/Brown
        imageSrc: brickIcon,
        iconColor: '#FFFFFF',
    },
    [ButtonType.putCity]: {
        fillColor: '#8EB50B', // Light Green
        imageSrc: sheepIcon,
        iconColor: '#FFFFFF',
    },
    [ButtonType.putRoad]: {
        fillColor: '#EFB516', // Yellow/Gold
        imageSrc: wheatIcon,
        iconColor: '#FFFFFF',
    },
    [ButtonType.putSettlement]: {
        fillColor: '#A2A8A4', // Grey
        imageSrc: stoneIcon,
        iconColor: '#FFFFFF',
    }
};