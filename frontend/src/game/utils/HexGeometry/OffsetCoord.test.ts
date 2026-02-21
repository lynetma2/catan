// utils/HexGeometry/OffsetCoord.test.ts
import { describe, it, expect } from 'vitest';
import { offsetCoord, type OffsetCoord } from './OffsetCoord'; // Adjust import path
import type { Hex } from '@/game/utils/HexGeometry/Hex';
import type { DoubledCoord } from '@/game/utils/HexGeometry/DoubledCoord';

describe('offsetCoord', () => {

    describe('Constants & create()', () => {
        it('should have correct EVEN and ODD constants', () => {
            expect(offsetCoord.EVEN).toBe(1);
            expect(offsetCoord.ODD).toBe(-1);
        });

        it('create() should construct an OffsetCoord object', () => {
            expect(offsetCoord.create(5, -3)).toEqual({ col: 5, row: -3 });
        });
    });

    describe('Error Handling', () => {
        const invalidOffset = 0;
        const validHex: Hex = { q: 0, r: 0, s: 0 };
        const validOffsetCoord: OffsetCoord = { col: 0, row: 0 };

        it('should throw if offset is not EVEN or ODD', () => {
            expect(() => offsetCoord.qoffsetFromCube(invalidOffset, validHex)).toThrowError(/EVEN/);
            expect(() => offsetCoord.qoffsetToCube(invalidOffset, validOffsetCoord)).toThrowError(/EVEN/);
            expect(() => offsetCoord.roffsetFromCube(invalidOffset, validHex)).toThrowError(/EVEN/);
            expect(() => offsetCoord.roffsetToCube(invalidOffset, validOffsetCoord)).toThrowError(/EVEN/);
        });
    });

    describe('qoffset (Flat-topped hex offsets)', () => {
        // Known coordinate math check
        it('should calculate specific qoffset correctly from Cube', () => {
            const hex: Hex = { q: 1, r: 2, s: -3 };

            // EVEN offset: parity = 1&1 = 1. row = 2 + (1 + 1)/2 = 3
            expect(offsetCoord.qoffsetFromCube(offsetCoord.EVEN, hex)).toEqual({ col: 1, row: 3 });

            // ODD offset: parity = 1&1 = 1. row = 2 + (1 - 1)/2 = 2
            expect(offsetCoord.qoffsetFromCube(offsetCoord.ODD, hex)).toEqual({ col: 1, row: 2 });
        });

        it('should round-trip correctly (Cube -> qoffset -> Cube)', () => {
            const testHexes: Hex[] = [
                { q: 0, r: 0, s: 0 },
                { q: 1, r: 2, s: -3 },   // positive, odd q
                { q: 2, r: 2, s: -4 },   // positive, even q
                { q: -1, r: -2, s: 3 },  // negative, odd q
                { q: -2, r: 3, s: -1 }   // negative, even q
            ];

            for (const hex of testHexes) {
                // Test EVEN
                const evenOffset = offsetCoord.qoffsetFromCube(offsetCoord.EVEN, hex);
                expect(offsetCoord.qoffsetToCube(offsetCoord.EVEN, evenOffset)).toEqual(hex);

                // Test ODD
                const oddOffset = offsetCoord.qoffsetFromCube(offsetCoord.ODD, hex);
                expect(offsetCoord.qoffsetToCube(offsetCoord.ODD, oddOffset)).toEqual(hex);
            }
        });
    });

    describe('roffset (Pointy-topped hex offsets)', () => {
        // Known coordinate math check
        it('should calculate specific roffset correctly from Cube', () => {
            const hex: Hex = { q: 2, r: 1, s: -3 };

            // EVEN offset: parity = 1&1 = 1. col = 2 + (1 + 1)/2 = 3
            expect(offsetCoord.roffsetFromCube(offsetCoord.EVEN, hex)).toEqual({ col: 3, row: 1 });

            // ODD offset: parity = 1&1 = 1. col = 2 + (1 - 1)/2 = 2
            expect(offsetCoord.roffsetFromCube(offsetCoord.ODD, hex)).toEqual({ col: 2, row: 1 });
        });

        it('should round-trip correctly (Cube -> roffset -> Cube)', () => {
            const testHexes: Hex[] = [
                { q: 0, r: 0, s: 0 },
                { q: 2, r: 1, s: -3 },   // positive, odd r
                { q: 2, r: 2, s: -4 },   // positive, even r
                { q: -2, r: -1, s: 3 },  // negative, odd r
                { q: -2, r: -2, s: 4 }   // negative, even r
            ];

            for (const hex of testHexes) {
                // Test EVEN
                const evenOffset = offsetCoord.roffsetFromCube(offsetCoord.EVEN, hex);
                expect(offsetCoord.roffsetToCube(offsetCoord.EVEN, evenOffset)).toEqual(hex);

                // Test ODD
                const oddOffset = offsetCoord.roffsetFromCube(offsetCoord.ODD, hex);
                expect(offsetCoord.roffsetToCube(offsetCoord.ODD, oddOffset)).toEqual(hex);
            }
        });
    });

    describe('Doubled Coordinates Conversion', () => {
        const testOffsets: OffsetCoord[] = [
            { col: 0, row: 0 },
            { col: 1, row: 2 },
            { col: 2, row: 2 },
            { col: -1, row: -2 },
            { col: -2, row: -2 },
        ];

        it('should round-trip Qdoubled coords (Offset -> Qdoubled -> Offset)', () => {
            for (const offset of testOffsets) {
                // Test EVEN
                const evenDoubled = offsetCoord.qoffsetToQdoubled(offsetCoord.EVEN, offset);
                expect(offsetCoord.qoffsetFromQdoubled(offsetCoord.EVEN, evenDoubled)).toEqual(offset);

                // Test ODD
                const oddDoubled = offsetCoord.qoffsetToQdoubled(offsetCoord.ODD, offset);
                expect(offsetCoord.qoffsetFromQdoubled(offsetCoord.ODD, oddDoubled)).toEqual(offset);
            }
        });

        it('should round-trip Rdoubled coords (Offset -> Rdoubled -> Offset)', () => {
            for (const offset of testOffsets) {
                // Test EVEN
                const evenDoubled = offsetCoord.roffsetToRdoubled(offsetCoord.EVEN, offset);
                expect(offsetCoord.roffsetFromRdoubled(offsetCoord.EVEN, evenDoubled)).toEqual(offset);

                // Test ODD
                const oddDoubled = offsetCoord.roffsetToRdoubled(offsetCoord.ODD, offset);
                expect(offsetCoord.roffsetFromRdoubled(offsetCoord.ODD, oddDoubled)).toEqual(offset);
            }
        });
    });
});