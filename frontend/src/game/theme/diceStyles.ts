export interface DiceStyle {
    backgroundColor: string;
    dotColor: string;
    borderColor: string;
    borderRadiusRatio: number;
    dotSizeRatio: number;
    borderWidth: number;
}

export const DEFAULT_DICE_STYLE: DiceStyle = {
    backgroundColor: "#fcfcfc",
    dotColor: "#1a1a1a",
    borderColor: "#000000",
    borderRadiusRatio: 0.2,
    dotSizeRatio: 0.1,
    borderWidth: 2
};