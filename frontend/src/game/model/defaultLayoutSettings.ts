import type {LayoutSettings} from "@/game/model/types.ts";
import {HexLayoutService} from "@/game/service/layout/hexLayoutService.ts";

export const defaultLayoutSettings: LayoutSettings = {
    size: { x: 50, y: 50 },
    origin: { x: 500, y: 500 },
    orientation: HexLayoutService.flat,
    roadWidth: 10,
    cityRadius: 10,
    settlementRadius: 5
}