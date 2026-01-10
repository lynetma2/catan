import type {LayoutSettings, Orientation, Point, WorldRatios} from "@/game/model/types.ts";
import worldLayout from "@/game/config/worldLayout.json";
import {HexLayoutService} from "@/game/layout/hexLayoutService.ts";

export class WorldLayoutService {

    public static getInitialLayout(viewportWidth: number, viewportHeight: number): LayoutSettings {
        const size = this.calculateInitialHexSize(viewportWidth, viewportHeight);
        const orientation = this.getOrientation();
        const ratios = this.calculateRatios();

        // Center origin initially
        const origin = { x: viewportWidth / 2, y: viewportHeight / 2 };

        return {
            size,
            origin,
            orientation,
            viewport: { width: viewportWidth, height: viewportHeight },
            ratios
        };
    }

    private static calculateRatios(): WorldRatios {
        const baseRadius = worldLayout.grid.baseHexRadius;
        const elements = worldLayout.elements;

        return {
            roadWidth: elements.road.baseWidth / baseRadius,
            settlementScale: elements.settlement.baseScale / baseRadius,
            cityScale: elements.city.baseScale / baseRadius,
            tile: {
                iconScale: elements.tile.baseIconScale / baseRadius,
                fontSize: elements.tile.baseFontSize / baseRadius,
                labelOffset: elements.tile.labelOffset / baseRadius
            }
        };
    }

    private static calculateInitialHexSize(viewportWidth: number, viewportHeight: number): Point {
        const config = worldLayout.initialView;
        const isFlat = worldLayout.grid.orientation === "flat";

        // Calculate pixels per hex based on target visible hexes across width
        const pixelsPerHex = viewportWidth / config.targetVisibleHexes;

        let radius: number;
        if (isFlat) {
            // Flat hex width = 2 * radius
            radius = pixelsPerHex / 2;
        } else {
            // Pointy hex width = sqrt(3) * radius
            radius = pixelsPerHex / Math.sqrt(3);
        }

        // Clamp radius
        radius = Math.max(config.minHexRadius, Math.min(config.maxHexRadius, radius));

        return { x: radius, y: radius };
    }

    private static getOrientation(): Orientation {
        return worldLayout.grid.orientation === "flat" ? HexLayoutService.flat : HexLayoutService.pointy;
    }
}
