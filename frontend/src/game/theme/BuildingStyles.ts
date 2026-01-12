import {BuildingType} from "@/game/model/enums.ts";
import cityIcon from '@/assets/city.svg';
import settlementIcon from '@/assets/settlement.svg';

export interface BuildingStyle {
    imageSrc: string;
    fillColor?: string;
}

export const BUILDING_STYLES: Record<BuildingType, BuildingStyle> = {
    [BuildingType.Settlement]: {
        imageSrc: settlementIcon,
    },
    [BuildingType.City]: {
        imageSrc: cityIcon,
    }
};