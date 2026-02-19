import { describe, it, expect } from 'vitest';
import { vec2 } from './Vec2';

describe('Vec2 Utils', () => {
    it('adds two vectors', () => {
        const a = { x: 1, y: 2 };
        const b = { x: 3, y: 4 };
        expect(vec2.add(a, b)).toEqual({ x: 4, y: 6 });
    });

    it('subtracts two vectors', () => {
        const a = { x: 10, y: 20 };
        const b = { x: 3, y: 5 };
        expect(vec2.subtract(a, b)).toEqual({ x: 7, y: 15 });
    });

    it('scales a vector', () => {
        const v = { x: 2, y: -3 };
        expect(vec2.scale(v, 3)).toEqual({ x: 6, y: -9 });
    });

    it('calculates length (magnitude)', () => {
        // 3-4-5 triangle
        const v = { x: 3, y: 4 };
        expect(vec2.length(v)).toBe(5);

        // Zero vector
        expect(vec2.length({ x: 0, y: 0 })).toBe(0);
    });

    it('calculates distance between two vectors', () => {
        const a = { x: 1, y: 1 };
        const b = { x: 4, y: 5 };
        // Distance is sqrt((4-1)^2 + (5-1)^2) = sqrt(9 + 16) = 5
        expect(vec2.distance(a, b)).toBe(5);
    });

    it('ensures operations are immutable', () => {
        const a = { x: 1, y: 1 };
        const b = { x: 2, y: 2 };

        vec2.add(a, b);
        vec2.scale(a, 5);

        // Originals should remain unchanged
        expect(a).toEqual({ x: 1, y: 1 });
        expect(b).toEqual({ x: 2, y: 2 });
    });
});