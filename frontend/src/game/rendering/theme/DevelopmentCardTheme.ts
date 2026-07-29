// game/rendering/theme/DevelopmentTheme.ts
import {DevelopmentCardType} from "@/game/core/types";

import knightIcon from '@/assets/developmentCards/knight.svg';
import roadIcon from '@/assets/developmentCards/roadBuilding.svg';
import monopolyIcon from '@/assets/developmentCards/monopoly.svg';
import victoryIcon from '@/assets/developmentCards/victoryPoint.svg';
import yearOfPlentyIcon from '@/assets/developmentCards/yearOfPlenty.svg';

export interface DevCardStyle {
    fillColor: string;
    imageSrc: string;
}

export const DEVELOPMENT_STYLES: Record<DevelopmentCardType, DevCardStyle> = {
    [DevelopmentCardType.Knight]: {
        fillColor: "#4a4a4a",
        imageSrc: knightIcon,
    },
    [DevelopmentCardType.RoadBuilding]: {
        fillColor: "#6b4e31",
        imageSrc: roadIcon,
    },
    [DevelopmentCardType.YearOfPlenty]: {
        fillColor: "#2d5a27",
        imageSrc: yearOfPlentyIcon,
    },
    [DevelopmentCardType.Monopoly]: {
        fillColor: "#8b3a62",
        imageSrc: monopolyIcon,
    },
    [DevelopmentCardType.VictoryPoint]: {
        fillColor: "#b8860b",
        imageSrc: victoryIcon,
    },
};