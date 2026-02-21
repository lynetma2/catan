import {GameKey, MouseButton, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
import type {Vec2} from "@/game/utils/Vec2.ts";
import type {InputLayer} from "@/game/core/Input/types.ts";

/**
 * Manages the input pipeline for the game canvas.
 *
 * The InputManager listens to raw DOM events on the provided canvas,
 * normalizes them into game-specific input events, and dispatches them
 * to registered input layers based on priority.
 */
export class InputManager {
    private readonly layers: InputLayer[] = [];

    /**
     * Creates an instance of InputManager.
     *
     * @param canvas - The HTML canvas element to listen for events on.
     */
    constructor(private readonly canvas: HTMLCanvasElement) {
        // All DOM listeners live here and nowhere else
        canvas.addEventListener('mousemove', e => this.onMouseMove(e));
        canvas.addEventListener('click',     e => this.onClick(e));
        canvas.addEventListener('keydown', e => this.onKeyDown(e));
    }

    /**
     * Registers a new input layer to handle events.
     * Layers are sorted by priority in descending order (highest priority first).
     *
     * @param layer - The input layer to register.
     */
    register(layer: InputLayer) {
        this.layers.push(layer);
        this.layers.sort((a, b) => b.priority - a.priority); // highest first
    }

    /**
     * Handles the raw mouse move event from the DOM.
     *
     * @param e - The raw MouseEvent.
     */
    private onMouseMove(e: MouseEvent) {
        this.dispatch({ type: 'mousemove', screenPos: this.toCanvasPos(e) });
    }

    /**
     * Handles the raw click event from the DOM.
     * Determines which mouse button was pressed and dispatches a normalized event.
     *
     * @param e - The raw MouseEvent.
     * @throws Error if an unsupported button type is detected.
     */
    private onClick(e: MouseEvent) {
        let buttonType: MouseButton;

        switch (e.button) {
            case 0:
                buttonType = MouseButton.Left;
                break;
            case 1:
                buttonType = MouseButton.Middle;
                break;
            case 2:
                buttonType = MouseButton.Right;
                break;
            default:
                throw new Error("Unsupported button type " + e.button);
        }

        this.dispatch({ type: 'click', screenPos: this.toCanvasPos(e), button: buttonType });
    }

    private onKeyDown(e: KeyboardEvent) {
        // we convert the incoming key to lowercase to ensure a match.
        const pressedKey = e.key.toLowerCase();
        const isGameKey: boolean = Object.values(GameKey).includes(pressedKey as GameKey);

        console.log("Key pressed: " + pressedKey + "")

        if (isGameKey) {
            this.dispatch({ type: 'keydown', key: pressedKey as GameKey });
        } else {
            // Ignore or log keys that aren't part of the game controls
            console.log(`Unmapped key pressed: ${e.key}`);
        }
    }

    /**
     * Dispatches a normalized input event to the registered layers.
     * Iteration stops if a layer returns true (indicating the event was consumed).
     *
     * @param event - The normalized input event to dispatch.
     */
    private dispatch(event: NormalizedInputEvent) {
        for (const layer of this.layers) {
            const consumed = layer.handleInput(event);
            if (consumed) break;
        }
    }

    /**
     * Converts browser client coordinates to canvas-local coordinates.
     *
     * @param e - The mouse event containing client coordinates.
     * @returns The 2D position relative to the canvas top-left corner.
     */
    private toCanvasPos(e: MouseEvent): Vec2 {
        const rect = this.canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
}