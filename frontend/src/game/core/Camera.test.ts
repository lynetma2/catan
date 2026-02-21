// core/Camera.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Camera } from './Camera';
import { layout } from '@/game/utils/HexGeometry/Layout';
import type { Orientation } from '@/game/utils/HexGeometry/Orientation';
import type { Resolution, ResolutionManager } from '@/game/core/ResolutionManager';

// Mock the layout utilities
vi.mock('@/game/utils/HexGeometry/Layout', () => ({
    layout: {
        create: vi.fn(),
        pixelToHexRounded: vi.fn(),
        hexToPixel: vi.fn(),
        polygonCorners: vi.fn(),
    }
}));

describe('Camera', () => {
    let camera: Camera;
    let mockOrientation: Orientation;
    let mockResolution: Resolution;
    let fakeResolutionManager: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockOrientation = {} as Orientation; // Mock orientation as needed
        mockResolution = { cssWidth: 800, cssHeight: 600, /* add other required props */ } as Resolution;

        // Create a fake ResolutionManager that allows us to manually trigger onChange
        fakeResolutionManager = {
            get: vi.fn(() => mockResolution),
            onChange: vi.fn(function(cb) {
                this.triggerChange = cb;
            }),
        } as unknown as ResolutionManager;

        // Setup mock return for layout.create
        (layout.create as any).mockReturnValue('mock-layout-object');

        camera = new Camera(mockOrientation, 50, fakeResolutionManager);
    });

    describe('Initialization & Resolution', () => {
        it('should initialize with default zoom and pan', () => {
            expect(camera.getZoom()).toBe(1);
            expect(camera.getPan()).toEqual({ x: 0, y: 0 });
        });

        it('should create an initial layout based on resolution', () => {
            expect(fakeResolutionManager.get).toHaveBeenCalled();
            expect(layout.create).toHaveBeenCalledWith(
                mockOrientation,
                { x: 50, y: 50 },
                { x: 400, y: 300 } // cssWidth / 2, cssHeight / 2
            );
        });

        it('should recreate layout when resolution changes', () => {
            const newResolution = { cssWidth: 1000, cssHeight: 800 } as Resolution;
            fakeResolutionManager.triggerChange(newResolution);

            expect(layout.create).toHaveBeenCalledWith(
                mockOrientation,
                { x: 50, y: 50 },
                { x: 500, y: 400 } // Re-centered
            );
        });
    });

    describe('Coordinate Translation', () => {
        it('toWorld should convert screen coordinates correctly', () => {
            camera.panBy({ x: 10, y: 20 });
            // At zoom 1, world pos = screen pos - pan
            expect(camera.toWorld({ x: 110, y: 120 })).toEqual({ x: 100, y: 100 });
        });

        it('toScreen should convert world coordinates correctly', () => {
            camera.panBy({ x: 10, y: 20 });
            // At zoom 1, screen pos = world pos + pan
            expect(camera.toScreen({ x: 100, y: 100 })).toEqual({ x: 110, y: 120 });
        });

        it('toWorld and toScreen should work with zoom', () => {
            camera.zoomAt({ x: 0, y: 0 }, 2); // zoom is now 2
            expect(camera.toScreen({ x: 100, y: 100 })).toEqual({ x: 200, y: 200 });
            expect(camera.toWorld({ x: 200, y: 200 })).toEqual({ x: 100, y: 100 });
        });
    });

    describe('Hex Conversions', () => {
        it('screenToHex should delegate to layout utilities', () => {
            const screenPos = { x: 100, y: 100 };
            const expectedHex = { q: 1, r: -1, s: 0 };
            (layout.pixelToHexRounded as any).mockReturnValue(expectedHex);

            const result = camera.screenToHex(screenPos);

            expect(layout.pixelToHexRounded).toHaveBeenCalledWith(
                'mock-layout-object',
                camera.toWorld(screenPos)
            );
            expect(result).toBe(expectedHex);
        });

        it('hexToScreen should delegate to layout utilities', () => {
            const hex = { q: 1, r: -1, s: 0 };
            const expectedWorldPos = { x: 50, y: 50 };
            (layout.hexToPixel as any).mockReturnValue(expectedWorldPos);

            const result = camera.hexToScreen(hex);

            expect(layout.hexToPixel).toHaveBeenCalledWith('mock-layout-object', hex);
            expect(result).toEqual(camera.toScreen(expectedWorldPos));
        });

        it('hexCornersScreen should translate polygon corners to screen coordinates', () => {
            const hex = { q: 1, r: -1, s: 0 };
            const mockCorners = [{ x: 10, y: 10 }, { x: 20, y: 20 }];
            (layout.polygonCorners as any).mockReturnValue(mockCorners);

            const result = camera.hexCornersScreen(hex);

            expect(layout.polygonCorners).toHaveBeenCalledWith('mock-layout-object', hex);
            expect(result).toEqual([
                camera.toScreen({ x: 10, y: 10 }),
                camera.toScreen({ x: 20, y: 20 })
            ]);
        });
    });

    describe('Mutation', () => {
        it('panBy should update pan coordinates', () => {
            camera.panBy({ x: 15, y: -5 });
            expect(camera.getPan()).toEqual({ x: 15, y: -5 });

            camera.panBy({ x: 5, y: 10 });
            expect(camera.getPan()).toEqual({ x: 20, y: 5 });
        });

        it('zoomAt should update zoom and pan towards the screen position', () => {
            // If we zoom in by 2x right on the point {x: 100, y: 100},
            // that specific screen point should remain at the same world coordinates.
            const screenPos = { x: 100, y: 100 };
            const worldPosBefore = camera.toWorld(screenPos);

            camera.zoomAt(screenPos, 2);

            const worldPosAfter = camera.toWorld(screenPos);
            expect(camera.getZoom()).toBe(2);
            expect(worldPosBefore).toEqual(worldPosAfter);
        });
    });

    describe('Canvas Transform', () => {
        it('applyTransform should call translate and scale on context', () => {
            const mockCtx = {
                translate: vi.fn(),
                scale: vi.fn()
            } as unknown as CanvasRenderingContext2D;

            camera.panBy({ x: 50, y: -50 });
            camera.zoomAt({ x: 0, y: 0 }, 1.5); // Sets zoom to 1.5

            camera.applyTransform(mockCtx);

            expect(mockCtx.translate).toHaveBeenCalledWith(camera.getPan().x, camera.getPan().y);
            expect(mockCtx.scale).toHaveBeenCalledWith(1.5, 1.5);
        });
    });
});