// utils/HexGeometry/Orientation.test.ts
import { describe, it, expect } from 'vitest';
import { orientation } from './Orientation';

describe('HexGeometry: orientation', () => {
    describe('create()', () => {
        it('should create an Orientation object mapping arguments to correct properties', () => {
            // Using sequential numbers makes it easy to spot if arguments get swapped
            const result = orientation.create(1, 2, 3, 4, 5, 6, 7, 8, 9);

            expect(result).toEqual({
                f0: 1,
                f1: 2,
                f2: 3,
                f3: 4,
                b0: 5,
                b1: 6,
                b2: 7,
                b3: 8,
                start_angle: 9,
            });
        });

        it('should handle standard hex orientation matrices properly (e.g., pointy-top)', () => {
            const sqrt3 = Math.sqrt(3);

            // Standard values for a pointy-topped hex grid
            const result = orientation.create(
                sqrt3, sqrt3 / 2.0, 0.0, 3.0 / 2.0,   // Forward matrix
                sqrt3 / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, // Inverse matrix
                0.5                                   // Start angle
            );

            expect(result.f0).toBe(sqrt3);
            expect(result.f1).toBe(sqrt3 / 2);
            expect(result.f2).toBe(0);
            expect(result.f3).toBe(1.5);

            expect(result.b0).toBe(sqrt3 / 3);
            expect(result.b1).toBe(-1/3);
            expect(result.b2).toBe(0);
            expect(result.b3).toBe(2/3);

            expect(result.start_angle).toBe(0.5);
        });
    });
});