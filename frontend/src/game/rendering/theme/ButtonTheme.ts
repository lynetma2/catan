
import pathIcon               from '@/assets/path.svg';
import settlementIcon         from '@/assets/settlement.svg';
import cityIcon               from '@/assets/city.svg';
import developmentCardBackIcon from '@/assets/developmentCard-back.svg';
import waitingIcon            from '@/assets/waiting.svg';
import endTurnIcon            from '@/assets/endTurn.svg';
import {ButtonType} from "@/game/hud/types.ts";

export interface ButtonStyle {
    fillColor:         string;
    imageSrc:          string;
    label:             string;
    // Only set these if the button genuinely differs from the theme default
    strokeColor?:      string;
    iconHeightOffset?: number;
    iconScale?:        number;
}

export const BUTTON_STYLES: Record<ButtonType, ButtonStyle> = {
    [ButtonType.putRoad]: {
        fillColor: '#EFB516',
        imageSrc:  pathIcon,
        label:     'Road',
    },
    [ButtonType.putSettlement]: {
        fillColor: '#A2A8A4',
        imageSrc:  settlementIcon,
        label:     'Settlement',
    },
    [ButtonType.putCity]: {
        fillColor: '#8EB50B',
        imageSrc:  cityIcon,
        label:     'City',
    },
    [ButtonType.drawDevelopmentCard]: {
        fillColor: '#ffffff',
        imageSrc:  developmentCardBackIcon,
        label:     'Dev Card',
    },
    [ButtonType.endTurn]: {
        fillColor: '#E06026',
        imageSrc:  endTurnIcon,
        label:     'End Turn',
    },
    [ButtonType.waiting]: {
        fillColor: '#ffffff',
        imageSrc:  waitingIcon,
        label:     'Waiting...',
    },
};