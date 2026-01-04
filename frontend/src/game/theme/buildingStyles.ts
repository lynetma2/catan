import {BuildingType} from "@/game/model/enums.ts";

export interface BuildingStyle {
    imageSrc: string;
}

export const BUILDING_STYLES: Record<BuildingType, BuildingStyle> = {
    [BuildingType.Settlement]: {
        imageSrc: 'assets/wood.png',
    },
    [BuildingType.City]: {
        imageSrc: 'assets/brick.png',
    }
};