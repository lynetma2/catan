import {ButtonType} from "@/game/model/enums.ts";

import pathIcon from '@/assets/path.svg';
import settlementIcon from '@/assets/settlement.svg';
import cityIcon from '@/assets/city.svg';
import developmentCardBackIcon from '@/assets/developmentCard-back.svg'
import waitingIcon from '@/assets/waiting.svg';
import endTurnIcon from '@/assets/endTurn.svg';

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
        imageSrc: developmentCardBackIcon,
        strokeColor: '#000', // Black
    },
    [ButtonType.endTurn]: {
        fillColor: '#E06026', // Red/Brown
        imageSrc: endTurnIcon,
        strokeColor: '#000', // Black
    },
    [ButtonType.putCity]: {
        fillColor: '#8EB50B', // Light Green
        imageSrc: cityIcon,
        strokeColor: '#000', // Black
    },
    [ButtonType.putRoad]: {
        fillColor: '#EFB516', // Yellow/Gold
        imageSrc: pathIcon,
        strokeColor: '#000', // Black
    },
    [ButtonType.putSettlement]: {
        fillColor: '#A2A8A4', // Grey
        imageSrc: settlementIcon,
        strokeColor: '#000', // Black
    },
    [ButtonType.waiting]: {
        fillColor: '#FFF',
        imageSrc: waitingIcon,
        strokeColor: '#000',
    }
};