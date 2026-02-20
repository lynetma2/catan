/**
 * Matrices and start angles for calculating hex-to-pixel and pixel-to-hex translations.
 */
export interface Orientation {
    /** Forward 2x2 matrix elements */
    f0: number;
    f1: number;
    f2: number;
    f3: number;

    /** Inverse 2x2 matrix elements */
    b0: number;
    b1: number;
    b2: number;
    b3: number;

    /** Starting angle in multiples of 60 degrees */
    start_angle: number;
}

/**
 * Utility functions for Orientation data.
 */
export const orientation = {
    /**
     * Creates a new Orientation configuration object.
     */
    create: (
        f0: number, f1: number, f2: number, f3: number,
        b0: number, b1: number, b2: number, b3: number,
        start_angle: number
    ): Orientation => ({
        f0, f1, f2, f3,
        b0, b1, b2, b3,
        start_angle
    })
};