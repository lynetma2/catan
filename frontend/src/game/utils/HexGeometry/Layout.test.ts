// utils/HexGeometry/Layout.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { layout } from './Layout';
import { hex } from '@/game/utils/HexGeometry/Hex';
import type { Vec2 } from '@/game/utils/Vec2';
import type { Hex } from '@/game/utils/HexGeometry/Hex';

describe('HexGeometry: layout', () => {
    // Custom helpers for checking floating point objects
    const expectVec2CloseTo = (actual: Vec2, expected: Vec2, numDigits = 4) => {
        expect(actual.x).toBeCloseTo(expected.x, numDigits);
        expect(actual.y).toBeCloseTo(expected.y, numDigits);
    };

    const expectHexCloseTo = (actual: Hex, expected: Hex, numDigits = 4) => {
        expect(actual.q).toBeCloseTo(expected.q, numDigits);
        expect(actual.r).toBeCloseTo(expected.r, numDigits);
        expect(actual.s).toBeCloseTo(expected.s, numDigits);
    };

    describe('Constants & create()', () => {
        it('should contain correct pointy and flat static configurations', () => {
            expect(layout.pointy.start_angle).toBe(0.5);
            expect(layout.flat.start_angle).toBe(0.0);
            expect(layout.pointy.f0).toBe(Math.sqrt(3.0));
            expect(layout.flat.f3).toBe(Math.sqrt(3.0));
        });

        it('create() should return a valid Layout object', () => {
            const size = { x: 10, y: 10 };
            const origin = { x: 50, y: 50 };
            const l = layout.create(layout.pointy, size, origin);

            expect(l.orientation).toBe(layout.pointy);
            expect(l.size).toBe(size);
            expect(l.origin).toBe(origin);
        });
    });

    describe('Hex <-> Pixel Conversions (Round Trips)', () => {
        const testHexes: Hex[] = [
            { q: 0, r: 0, s: 0 },
            { q: 1, r: -1, s: 0 },
            { q: 2, r: 3, s: -5 },
            { q: -2, r: -2, s: 4 }
        ];

        it('should round-trip Pointy orientation correctly (Hex -> Pixel -> Fractional Hex)', () => {
            const l = layout.create(layout.pointy, { x: 20, y: 20 }, { x: 100, y: 100 });

            for (const h of testHexes) {
                const pixel = layout.hexToPixel(l, h);
                const fractionalHex = layout.pixelToHexFractional(l, pixel);
                expectHexCloseTo(fractionalHex, h);
            }
        });

        it('should round-trip Flat orientation correctly (Hex -> Pixel -> Fractional Hex)', () => {
            const l = layout.create(layout.flat, { x: 15, y: 25 }, { x: -50, y: 50 });

            for (const h of testHexes) {
                const pixel = layout.hexToPixel(l, h);
                const fractionalHex = layout.pixelToHexFractional(l, pixel);
                expectHexCloseTo(fractionalHex, h);
            }
        });
    });

    describe('pixelToHexRounded', () => {
        let roundSpy: any;

        beforeEach(() => {
            // Spy on the hex.round function to ensure it's called with the fractional hex
            // We provide a dummy implementation to isolate the layout logic
            roundSpy = vi.spyOn(hex, 'round').mockImplementation((h: Hex) => ({
                q: Math.round(h.q),
                r: Math.round(h.r),
                s: Math.round(h.s)
            }));
        });

        afterEach(() => {
            roundSpy.mockRestore();
        });

        it('should convert pixel to fractional hex and pass it to hex.round', () => {
            const l = layout.create(layout.flat, { x: 10, y: 10 }, { x: 0, y: 0 });

            // Pick a pixel exactly on a hex center
            const p = layout.hexToPixel(l, { q: 1, r: 2, s: -3 });

            const result = layout.pixelToHexRounded(l, p);

            expect(roundSpy).toHaveBeenCalledTimes(1);

            // Verify the argument passed to round() was the fractional equivalent
            const argPassedToRound = roundSpy.mock.calls[0][0];
            expectHexCloseTo(argPassedToRound, { q: 1, r: 2, s: -3 });

            // Verify our mocked result is returned
            expect(result).toEqual({ q: 1, r: 2, s: -3 });
        });
    });

    describe('Geometry & Drawing (Corners)', () => {
        it('should calculate correct corner offsets for Flat orientation', () => {
            const l = layout.create(layout.flat, { x: 10, y: 10 }, { x: 0, y: 0 });

            // For a flat top, corner 0 (angle 0) should be exactly straight right (+size.x, 0)
            const corner0 = layout.hexCornerOffset(l, 0);
            expectVec2CloseTo(corner0, { x: 10, y: 0 });

            // Corner 3 is the opposite, straight left (-size.x, 0)
            const corner3 = layout.hexCornerOffset(l, 3);
            expectVec2CloseTo(corner3, { x: -10, y: 0 });
        });

        it('should calculate correct corner offsets for Pointy orientation', () => {
            const l = layout.create(layout.pointy, { x: 10, y: 10 }, { x: 0, y: 0 });

            // For pointy top, start angle is 0.5 (30 degrees).
            // Corner 0 math: x = size * cos(30deg), y = size * sin(30deg)
            const expectedX = 10 * (Math.sqrt(3) / 2);
            const expectedY = 10 * 0.5;

            const corner0 = layout.hexCornerOffset(l, 0);
            expectVec2CloseTo(corner0, { x: expectedX, y: expectedY });
        });

        it('polygonCorners should return 6 absolute pixel coordinates centered on the hex', () => {
            const l = layout.create(layout.flat, { x: 10, y: 10 }, { x: 100, y: 100 });
            const h = { q: 1, r: 0, s: -1 };

            const center = layout.hexToPixel(l, h);
            const corners = layout.polygonCorners(l, h);

            expect(corners.length).toBe(6);

            // Verify the first corner is exactly center + cornerOffset(0)
            const offset0 = layout.hexCornerOffset(l, 0);
            expectVec2CloseTo(corners[0], {
                x: center.x + offset0.x,
                y: center.y + offset0.y
            });

            // Verify the last corner is exactly center + cornerOffset(5)
            const offset5 = layout.hexCornerOffset(l, 5);
            expectVec2CloseTo(corners[5], {
                x: center.x + offset5.x,
                y: center.y + offset5.y
            });
        });
    });
});