import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InputManager } from './InputManager';
import type { InputLayer } from '@/game/core/Input/types';

describe('InputManager', () => {
    let canvas: HTMLCanvasElement;
    let inputManager: InputManager;

    beforeEach(() => {
        // 1. Create a mock canvas element
        canvas = document.createElement('canvas');

        // 2. Mock getBoundingClientRect to return a fixed position
        //    This ensures our coordinate math tests are deterministic.
        //    Let's say the canvas is at (x: 10, y: 10) on the page.
        vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
            left: 10,
            top: 10,
            right: 110,
            bottom: 110,
            width: 100,
            height: 100,
            x: 10,
            y: 10,
            toJSON: () => {},
        });

        inputManager = new InputManager(canvas);
    });

    it('registers layers and sorts them by priority', () => {
        const lowPriorityLayer: InputLayer = {
            priority: 1,
            handleInput: vi.fn().mockReturnValue(false),
        };
        const highPriorityLayer: InputLayer = {
            priority: 10,
            handleInput: vi.fn().mockReturnValue(false),
        };

        inputManager.register(lowPriorityLayer);
        inputManager.register(highPriorityLayer);

        // Trigger an event to verify call order
        canvas.dispatchEvent(new MouseEvent('click', { button: 0 }));

        // Check invocation order
        const highCallOrder = vi.mocked(highPriorityLayer.handleInput).mock.invocationCallOrder[0];
        const lowCallOrder = vi.mocked(lowPriorityLayer.handleInput).mock.invocationCallOrder[0];

        expect(highCallOrder).toBeLessThan(lowCallOrder);
    });

    it('converts page coordinates to canvas-local coordinates', () => {
        const layer: InputLayer = {
            priority: 1,
            handleInput: vi.fn(),
        };
        inputManager.register(layer);

        // Canvas is at (10, 10). Mouse is at (50, 60).
        // Expected Result: (40, 50)
        canvas.dispatchEvent(new MouseEvent('mousemove', {
            clientX: 50,
            clientY: 60,
        }));

        expect(layer.handleInput).toHaveBeenCalledWith(expect.objectContaining({
            type: 'mousemove',
            screenPos: { x: 40, y: 50 },
        }));
    });

    it('stops propagation if a layer consumes the event', () => {
        const consumerLayer: InputLayer = {
            priority: 10,
            handleInput: vi.fn().mockReturnValue(true), // Returns true to consume
        };
        const ignoredLayer: InputLayer = {
            priority: 1,
            handleInput: vi.fn(),
        };

        inputManager.register(ignoredLayer);
        inputManager.register(consumerLayer);

        canvas.dispatchEvent(new MouseEvent('click', { button: 0 }));

        expect(consumerLayer.handleInput).toHaveBeenCalled();
        expect(ignoredLayer.handleInput).not.toHaveBeenCalled();
    });

    it('correctly identifies mouse buttons', () => {
        const layer: InputLayer = { priority: 1, handleInput: vi.fn() };
        inputManager.register(layer);

        // Test Right Click (button 2)
        canvas.dispatchEvent(new MouseEvent('click', { button: 2 }));

        expect(layer.handleInput).toHaveBeenCalledWith(expect.objectContaining({
            type: 'click',
            button: 'right',
        }));

        // Test Middle Click (button 1)
        canvas.dispatchEvent(new MouseEvent('click', { button: 1 }));

        expect(layer.handleInput).toHaveBeenCalledWith(expect.objectContaining({
            type: 'click',
            button: 'middle',
        }));
    });

    it('throws error on unsupported button types', () => {
        // Button 4 is not supported in your switch case
        expect(() => canvas.dispatchEvent(new MouseEvent('click', { button: 4 })))
            .toThrowError(/Unsupported button type/);
    });
});