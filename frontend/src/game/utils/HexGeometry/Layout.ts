import type {Vec2} from "@/game/utils/Vec2.ts";
import type {Orientation} from "@/game/utils/HexGeometry/Orientation.ts";
import {hex, type Hex} from "@/game/utils/HexGeometry/Hex.ts";

/**
 * Configuration for drawing and interacting with the hex grid.
 * (Assumes Vec2, Hex, and Orientation interfaces are defined)
 */
export interface Layout {
    orientation: Orientation;
    size: Vec2;
    origin: Vec2;
}

/**
 * Utility functions for grid layout and pixel transformations.
 * All operations are pure and require the Layout configuration
 * to be passed as the first argument.
 */
export const layout = {
    /** * Static configuration for "pointy topped" hexes
     */
    pointy: {
        f0: Math.sqrt(3.0), f1: Math.sqrt(3.0) / 2.0, f2: 0.0, f3: 3.0 / 2.0,
        b0: Math.sqrt(3.0) / 3.0, b1: -1.0 / 3.0, b2: 0.0, b3: 2.0 / 3.0,
        start_angle: 0.5
    } as Orientation,

    /** * Static configuration for "flat topped" hexes
     */
    flat: {
        f0: 3.0 / 2.0, f1: 0.0, f2: Math.sqrt(3.0) / 2.0, f3: Math.sqrt(3.0),
        b0: 2.0 / 3.0, b1: 0.0, b2: -1.0 / 3.0, b3: Math.sqrt(3.0) / 3.0,
        start_angle: 0.0
    } as Orientation,

    /**
     * Creates a new Layout configuration object.
     */
    create: (orientation: Orientation, size: Vec2, origin: Vec2): Layout => ({
        orientation,
        size,
        origin
    }),

    /**
     * Converts a cube hex coordinate to a 2D pixel coordinate (the center of the hex).
     */
    hexToPixel: (l: Layout, h: Hex): Vec2 => {
        const M = l.orientation;
        const x = (M.f0 * h.q + M.f1 * h.r) * l.size.x;
        const y = (M.f2 * h.q + M.f3 * h.r) * l.size.y;
        return {
            x: x + l.origin.x,
            y: y + l.origin.y
        };
    },

    /**
     * Converts a 2D pixel coordinate to a fractional cube hex coordinate.
     */
    pixelToHexFractional: (l: Layout, p: Vec2): Hex => {
        const M = l.orientation;
        const pt = {
            x: (p.x - l.origin.x) / l.size.x,
            y: (p.y - l.origin.y) / l.size.y
        };
        const q = M.b0 * pt.x + M.b1 * pt.y;
        const r = M.b2 * pt.x + M.b3 * pt.y;
        return { q, r, s: -q - r };
    },

    /**
     * Converts a 2D pixel coordinate to the nearest valid integer hex coordinate.
     * (Assumes the `hex.round` utility is available from your Hex implementation)
     */
    pixelToHexRounded: (l: Layout, p: Vec2): Hex => {
        const fractionalHex = layout.pixelToHexFractional(l, p);
        return hex.round(fractionalHex);
    },

    /**
     * Calculates the pixel offset from the center of a hex to one of its 6 corners.
     */
    hexCornerOffset: (l: Layout, corner: number): Vec2 => {
        const M = l.orientation;
        const angle = 2.0 * Math.PI * (M.start_angle - corner) / 6.0;
        return {
            x: l.size.x * Math.cos(angle),
            y: l.size.y * Math.sin(angle)
        };
    },

    /**
     * Returns the 6 screen points needed to draw the outline of a hexagon.
     */
    polygonCorners: (l: Layout, h: Hex): Vec2[] => {
        const corners: Vec2[] = [];
        const center = layout.hexToPixel(l, h);
        for (let i = 0; i < 6; i++) {
            const offset = layout.hexCornerOffset(l, i);
            corners.push({
                x: center.x + offset.x,
                y: center.y + offset.y
            });
        }
        return corners;
    }
};