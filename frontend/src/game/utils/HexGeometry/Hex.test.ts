// utils/HexGeometry/Hex.test.ts
import { describe, it, expect } from 'vitest';
import { hex, type Hex } from './Hex';

describe('Hex Math Utilities', () => {

    describe('create()', () => {
        it('should create a valid hex when q + r + s === 0', () => {
            const h = hex.create(1, -2, 1);
            expect(h).toEqual({ q: 1, r: -2, s: 1 });
        });

        it('should throw an error when q + r + s !== 0', () => {
            expect(() => hex.create(1, 1, 1)).toThrowError("q + r + s must be 0");
            expect(() => hex.create(1, -2, 2)).toThrowError("q + r + s must be 0");
        });

        it('should allow small floating point imprecision due to Math.round internally', () => {
            const h = hex.create(1.1, -2.2, 1.1); // sum is 0
            expect(h).toEqual({ q: 1.1, r: -2.2, s: 1.1 });
        });
    });

    describe('Core Arithmetic (add, subtract, scale)', () => {
        const a: Hex = { q: 1, r: -3, s: 2 };
        const b: Hex = { q: 3, r: -7, s: 4 };

        it('should add two hexes', () => {
            expect(hex.add(a, b)).toEqual({ q: 4, r: -10, s: 6 });
        });

        it('should subtract hex b from hex a', () => {
            expect(hex.subtract(a, b)).toEqual({ q: -2, r: 4, s: -2 });
            expect(hex.subtract(b, a)).toEqual({ q: 2, r: -4, s: 2 });
        });

        it('should scale a hex by a scalar value', () => {
            expect(hex.scale(a, 3)).toEqual({ q: 3, r: -9, s: 6 });
        });
    });

    describe('Rotations', () => {
        const h: Hex = { q: 1, r: -3, s: 2 };

        it('should rotate left (counter-clockwise)', () => {
            // formula: q = -s, r = -q, s = -r
            expect(hex.rotateLeft(h)).toEqual({ q: -2, r: -1, s: 3 });
        });

        it('should rotate right (clockwise)', () => {
            // formula: q = -r, r = -s, s = -q
            expect(hex.rotateRight(h)).toEqual({ q: 3, r: -2, s: -1 });
        });

        it('6 rotations should return to the original position', () => {
            let current = h;
            for (let i = 0; i < 6; i++) {
                current = hex.rotateLeft(current);
            }
            expect(current).toEqual(h);
        });
    });

    describe('Neighbors & Directions', () => {
        const center: Hex = { q: 0, r: 0, s: 0 };

        it('should fetch standard direction vectors', () => {
            expect(hex.direction(0)).toEqual({ q: 1, r: 0, s: -1 });
            expect(hex.direction(5)).toEqual({ q: 0, r: 1, s: -1 });
        });

        it('should compute neighbor properly', () => {
            // center + dir 0 (1, 0, -1) = (1, 0, -1)
            expect(hex.neighbor(center, 0)).toEqual({ q: 1, r: 0, s: -1 });
        });

        it('should fetch diagonal direction vectors', () => {
            expect(hex.diagonals[0]).toEqual({ q: 2, r: -1, s: -1 });
        });

        it('should compute diagonal neighbor properly', () => {
            expect(hex.diagonalNeighbor(center, 0)).toEqual({ q: 2, r: -1, s: -1 });
        });
    });

    describe('Distance and Length', () => {
        it('len() should calculate distance from origin', () => {
            expect(hex.len({ q: 0, r: 0, s: 0 })).toBe(0);
            expect(hex.len({ q: 2, r: -1, s: -1 })).toBe(2);
            expect(hex.len({ q: -3, r: 1, s: 2 })).toBe(3);
        });

        it('distance() should calculate distance between two arbitrary hexes', () => {
            const a: Hex = { q: 1, r: 0, s: -1 };
            const b: Hex = { q: -2, r: 4, s: -2 };
            // subtract a - b: {3, -4, 1} -> len = (3 + 4 + 1)/2 = 4
            expect(hex.distance(a, b)).toBe(4);
        });
    });

    describe('Rounding', () => {
        it('should snap exact fractional coordinates to nearest integer hex', () => {
            const fractional1: Hex = { q: 0.1, r: 0.8, s: -0.9 };
            expect(hex.round(fractional1)).toEqual({ q: 0, r: 1, s: -1 });

            // FIX: Updated to the correct nearest neighbor
            const fractional2: Hex = { q: 1.4, r: -0.6, s: -0.8 };
            expect(hex.round(fractional2)).toEqual({ q: 1, r: 0, s: -1 });
        });

        it('should resolve edge case collisions correctly (adjusting the coordinate with the largest diff)', () => {
            // Here, rounding q=0, r=0, s=-1 produces a sum of -1 (invalid).
            // Diffs: q_diff=0.4, r_diff=0.4, s_diff=0.2.
            // Since q_diff and r_diff tie, the logic adjusts r (or q depending on exact float math).
            const edgeCase: Hex = { q: 0.4, r: 0.4, s: -0.8 };
            const result = hex.round(edgeCase);

            // Check that constraints are satisfied
            expect(result.q + result.r + result.s).toBe(0);
            // It should snap to either {0, 1, -1} or {1, 0, -1}
            expect(result).toEqual({ q: 0, r: 1, s: -1 });
        });

        it('should adjust q coordinate when q_diff is the largest rounding error', () => {
            // Fractional sum is 0 (0.4 + 0.3 - 0.7 = 0)
            // Individual rounds: qi=0, ri=0, si=-1 (Sum = -1)
            // q_diff (0.4) is larger than r_diff (0.3) and s_diff (0.3)
            const fractionalQ: Hex = { q: 0.4, r: 0.3, s: -0.7 };

            // It should trigger the first if-statement and recalculate qi to 1
            expect(hex.round(fractionalQ)).toEqual({ q: 1, r: 0, s: -1 });
        });
    });

    describe('Linear Interpolation & Line Drawing', () => {

        it('lerp() should interpolate correctly between two hexes', () => {
            const a: Hex = { q: 0, r: 0, s: 0 };
            const b: Hex = { q: 10, r: -10, s: 0 };

            expect(hex.lerp(a, b, 0.5)).toEqual({ q: 5, r: -5, s: 0 });
            expect(hex.lerp(a, b, 0.1)).toEqual({ q: 1, r: -1, s: 0 });
        });

        it('linedraw() should return an array of hexes forming a line', () => {
            const start: Hex = { q: 0, r: 0, s: 0 };
            const end: Hex = { q: 2, r: -2, s: 0 };

            const line = hex.linedraw(start, end);

            expect(line.length).toBe(3); // start, middle, end
            expect(line[0]).toEqual(start);
            expect(line[1]).toEqual({ q: 1, r: -1, s: 0 });
            expect(line[2]).toEqual(end);
        });

        it('linedraw() should handle a zero-length line', () => {
            const start: Hex = { q: 1, r: -1, s: 0 };
            const line = hex.linedraw(start, start);

            expect(line.length).toBe(1);
            expect(line[0]).toEqual(start);
        });
    });
});