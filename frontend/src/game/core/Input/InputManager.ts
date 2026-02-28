import {GameKey, InputType, MouseButton, type NormalizedInputEvent} from "@/game/core/Input/InputEvent.ts";
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
    private readonly abortController = new AbortController();

    /**
     * Creates an instance of InputManager.
     *
     * @param canvas - The HTML canvas element to listen for events on.
     */
    constructor(private readonly canvas: HTMLCanvasElement) {
        const opts = {signal: this.abortController.signal};
        // All DOM listeners live here and nowhere else
        canvas.addEventListener('mousemove', e => this.onMouseMove(e), opts);
        canvas.addEventListener('click',     e => this.onClick(e), opts);
        canvas.addEventListener('keydown', e => this.onKeyDown(e), opts);
        canvas.addEventListener('mousedown',  e => this.onMouseDown(e), opts);
        canvas.addEventListener('mouseup',    e => this.onMouseUp(e), opts);
        canvas.addEventListener('wheel',      e => this.onWheel(e), { ...opts, passive: true });
        canvas.addEventListener('contextmenu', e => e.preventDefault(), opts); // prevent right-click menu
        canvas.addEventListener('mouseleave', e => this.onMouseLeave(e), opts);
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

    destroy() {
        this.abortController.abort();
    }

    /**
     * Handles the raw mouse move event from the DOM.
     *
     * @param e - The raw MouseEvent.
     */
    private onMouseMove(e: MouseEvent) {
        this.dispatch({ type: InputType.MouseMove, screenPos: this.toCanvasPos(e) });
    }

    /**
     * Handles the raw click event from the DOM.
     * Determines which mouse button was pressed and dispatches a normalized event.
     *
     * @param e - The raw MouseEvent.
     * @throws Error if an unsupported button type is detected.
     */
    private onClick(e: MouseEvent) {
        this.dispatch({
            type:      InputType.MouseClick,
            screenPos: this.toCanvasPos(e),
            button:    this.toMouseButton(e.button),
        });
    }

    private toMouseButton(button: number): MouseButton {
        switch (button) {
            case 0:  return MouseButton.Left;
            case 1:  return MouseButton.Middle;
            case 2:  return MouseButton.Right;
            default: return MouseButton.Left;
        }
    }


    private onKeyDown(e: KeyboardEvent) {
        // we convert the incoming key to lowercase to ensure a match.
        const pressedKey = e.key.toLowerCase();
        const isGameKey: boolean = Object.values(GameKey).includes(pressedKey as GameKey);

        console.log("Key pressed: " + pressedKey + "")

        if (isGameKey) {
            this.dispatch({ type: InputType.KeyDown, key: pressedKey as GameKey });
        } else {
            // Ignore or log keys that aren't part of the game controls
            console.log(`Unmapped key pressed: ${e.key}`);
        }
    }

    private onMouseLeave(e: MouseEvent) {
        this.dispatch({
            type: InputType.MouseLeave
        });
    }

    private onMouseDown(e: MouseEvent) {
        this.dispatch({
            type:      InputType.MouseDown,
            screenPos: this.toCanvasPos(e),
            button:    this.toMouseButton(e.button),
        });
    }

    private onMouseUp(e: MouseEvent) {
        this.dispatch({
            type:      InputType.MouseUp,
            screenPos: this.toCanvasPos(e),
            button:    this.toMouseButton(e.button),
        });
    }

    private onWheel(e: WheelEvent) {
        this.dispatch({
            type:      InputType.Wheel,
            screenPos: this.toCanvasPos(e),
            delta:     e.deltaY,
        });
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