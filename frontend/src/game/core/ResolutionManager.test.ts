// core/ResolutionManager.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ResolutionManager } from './ResolutionManager';

describe('ResolutionManager', () => {
    let canvas: HTMLCanvasElement;
    let mockScale: any;
    let resizeCallback: ResizeObserverCallback;
    let mockDisconnect: any;

    beforeEach(() => {
        // 1. Create a real DOM element using happy-dom
        canvas = document.createElement('canvas');

        // Override layout properties (happy-dom doesn't calculate layout by default)
        // We use Object.defineProperty so we can update them later in tests
        let clientWidth = 800;
        let clientHeight = 600;

        Object.defineProperty(canvas, 'clientWidth', {
            get: () => clientWidth,
            set: (v) => clientWidth = v,
            configurable: true
        });
        Object.defineProperty(canvas, 'clientHeight', {
            get: () => clientHeight,
            set: (v) => clientHeight = v,
            configurable: true
        });

        // 2. Intercept getContext to spy on the 2D context API
        mockScale = vi.fn();
        vi.spyOn(canvas, 'getContext').mockReturnValue({ scale: mockScale } as any);

        // 3. Set devicePixelRatio on the happy-dom window
        vi.stubGlobal('devicePixelRatio', 2);

        // 4. Mock ResizeObserver
        mockDisconnect = vi.fn();

        // FIX: Use a standard function, NOT an arrow function
        const MockObserver = vi.fn(function(cb: ResizeObserverCallback) {
            resizeCallback = cb;
            return {
                observe: vi.fn(),
                disconnect: mockDisconnect,
                unobserve: vi.fn(),
            };
        });

        vi.stubGlobal('ResizeObserver', MockObserver);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    describe('Initialization', () => {
        it('should measure and apply resolution on construction', () => {
            const manager = new ResolutionManager(canvas);

            expect(manager.get()).toEqual({
                cssWidth: 800,
                cssHeight: 600,
                pixelWidth: 1600,
                pixelHeight: 1200,
                dpr: 2,
            });

            // Verify mutations on the actual canvas element
            expect(canvas.width).toBe(1600);
            expect(canvas.height).toBe(1200);
            expect(mockScale).toHaveBeenCalledWith(2, 2);
        });

        it('should default to dpr 1 if window.devicePixelRatio is undefined', () => {
            // Force the property to be undefined to trigger the ?? 1 fallback
            vi.stubGlobal('devicePixelRatio', undefined);

            // Create the manager
            const manager = new ResolutionManager(canvas);

            // The dpr should be exactly 1
            expect(manager.get().dpr).toBe(1);

            // Cleanup the stub for the next tests
            vi.unstubAllGlobals();
        });
    });

    describe('Event Handling (ResizeObserver)', () => {
        it('should trigger listeners and apply new resolution on resize', () => {
            const manager = new ResolutionManager(canvas);
            const listener = vi.fn();
            manager.onChange(listener);

            // 1. Update the DOM properties
            // (We assign to the property, which updates our getter via defineProperty logic above)
            // @ts-ignore - writing to readonly property for test simulation
            canvas.clientWidth = 1000;
            // @ts-ignore
            canvas.clientHeight = 800;

            // 2. Manually trigger the observer callback
            // (Arguments don't matter as the class re-measures the element directly)
            resizeCallback([] as any, null as any);

            const expectedResolution = {
                cssWidth: 1000,
                cssHeight: 800,
                pixelWidth: 2000,
                pixelHeight: 1600,
                dpr: 2,
            };

            expect(listener).toHaveBeenCalledWith(expectedResolution);
            expect(canvas.width).toBe(2000);
            expect(mockScale).toHaveBeenCalledTimes(2); // Initial + Resize
        });

        it('should ignore resize events if CSS dimensions have not changed', () => {
            const manager = new ResolutionManager(canvas);
            const listener = vi.fn();
            manager.onChange(listener);

            // Trigger callback without changing dimensions
            resizeCallback([] as any, null as any);

            expect(listener).not.toHaveBeenCalled();
            expect(mockScale).toHaveBeenCalledTimes(1);
        });
    });

    describe('Lifecycle', () => {
        it('should disconnect observer on destroy', () => {
            const manager = new ResolutionManager(canvas);
            manager.destroy();
            expect(mockDisconnect).toHaveBeenCalled();
        });
    });
});