// utils/HexGeometry/DoubledCoord.test.ts
import { describe, it, expect } from 'vitest';
import { doubledCoord, type DoubledCoord } from './DoubledCoord'; // Adjust import path as needed
import type { Hex } from '@/game/utils/HexGeometry/Hex';

describe('DoubledCoord', () => {

    describe('create()', () => {
        it('should create a DoubledCoord object', () => {
            expect(doubledCoord.create(5, -3)).toEqual({ col: 5, row: -3 });
        });
    });

    describe('qdoubled (Flat-topped hexes)', () => {
        it('should calculate specific qdoubled coordinates correctly from Cube', () => {
            // formula: col = q, row = 2r + q
            const h1: Hex = { q: 1, r: 2, s: -3 };
            expect(doubledCoord.qdoubledFromCube(h1)).toEqual({ col: 1, row: 5 });

            const h2: Hex = { q: 2, r: -1, s: -1 };
            expect(doubledCoord.qdoubledFromCube(h2)).toEqual({ col: 2, row: 0 });
        });

        it('should calculate specific Cube coordinates correctly from qdoubled', () => {
            // formula: q = col, r = (row - col) / 2
            const d1: DoubledCoord = { col: 1, row: 5 };
            expect(doubledCoord.qdoubledToCube(d1)).toEqual({ q: 1, r: 2, s: -3 });

            const d2: DoubledCoord = { col: 2, row: 0 };
            expect(doubledCoord.qdoubledToCube(d2)).toEqual({ q: 2, r: -1, s: -1 });
        });

        it('should round-trip correctly (Cube -> qdoubled -> Cube)', () => {
            const testHexes: Hex[] = [
                { q: 0, r: 0, s: 0 },
                { q: 1, r: 2, s: -3 },
                { q: -2, r: 1, s: 1 },
                { q: 3, r: -5, s: 2 }
            ];

            for (const hex of testHexes) {
                const doubled = doubledCoord.qdoubledFromCube(hex);
                const result = doubledCoord.qdoubledToCube(doubled);
                expect(result).toEqual(hex);
            }
        });
    });

    describe('rdoubled (Pointy-topped hexes)', () => {
        it('should calculate specific rdoubled coordinates correctly from Cube', () => {
            // formula: col = 2q + r, row = r
            const h1: Hex = { q: 1, r: 2, s: -3 };
            expect(doubledCoord.rdoubledFromCube(h1)).toEqual({ col: 4, row: 2 });

            const h2: Hex = { q: 2, r: -1, s: -1 };
            expect(doubledCoord.rdoubledFromCube(h2)).toEqual({ col: 3, row: -1 });
        });

        it('should calculate specific Cube coordinates correctly from rdoubled', () => {
            // formula: q = (col - row) / 2, r = row
            const d1: DoubledCoord = { col: 4, row: 2 };
            expect(doubledCoord.rdoubledToCube(d1)).toEqual({ q: 1, r: 2, s: -3 });

            const d2: DoubledCoord = { col: 3, row: -1 };
            expect(doubledCoord.rdoubledToCube(d2)).toEqual({ q: 2, r: -1, s: -1 });
        });

        it('should round-trip correctly (Cube -> rdoubled -> Cube)', () => {
            const testHexes: Hex[] = [
                { q: 0, r: 0, s: 0 },
                { q: 1, r: 2, s: -3 },
                { q: -2, r: 1, s: 1 },
                { q: 3, r: -5, s: 2 }
            ];

            for (const hex of testHexes) {
                const doubled = doubledCoord.rdoubledFromCube(hex);
                const result = doubledCoord.rdoubledToCube(doubled);
                expect(result).toEqual(hex);
            }
        });
    });
});