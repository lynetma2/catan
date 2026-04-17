

/**
 * A 2D vector with x and y components.
 */
export interface Vec2 {
    /** Horizontal component */
    x: number;

    /** Vertical component */
    y: number;
}

/**
 * Utility functions for working with 2D vectors.
 *
 * All operations are immutable — they return new Vec2 objects
 * and never mutate the input vectors.
 */
export const vec2 = {
    /**
     * Adds two vectors component-wise.
     * @returns A new vector representing a + b
     */
    add: (a: Vec2, b: Vec2): Vec2 => ({
        x: a.x + b.x,
        y: a.y + b.y
    }),

    /**
     * Subtracts vector b from vector a.
     * @returns A new vector representing a - b
     */
    subtract: (a: Vec2, b: Vec2): Vec2 => ({
        x: a.x - b.x,
        y: a.y - b.y
    }),

    /**
     * Scales a vector by a scalar value.
     * @param s The scalar multiplier
     * @returns A new scaled vector
     */
    scale: (v: Vec2, s: number): Vec2 => ({
        x: v.x * s,
        y: v.y * s
    }),

    /**
     * Computes the Euclidean length (magnitude) of a vector.
     * Equivalent to √(x² + y²).
     */
    length: (v: Vec2): number =>
        Math.hypot(v.x, v.y),

    /**
     * Computes the Euclidean distance between two vectors.
     * Equivalent to length(a - b).
     */
    distance: (a: Vec2, b: Vec2): number =>
        vec2.length(vec2.subtract(a, b)),
};