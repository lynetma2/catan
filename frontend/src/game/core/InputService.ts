import type {GameState, LayoutSettings} from "@/game/model/types.ts";
import {MoveType, ResourceType} from "@/game/model/enums.ts";
import {Logger} from "@/game/utils/Logger.ts";

export class InputService {
    private canvas: HTMLCanvasElement;
    
    // The callback that the GameLoop will assign
    public onMouseClick?: (x: number, y: number) => void;
    public onMouseMove?: (x: number, y: number) => void;
    public onPan?: (dx: number, dy: number) => void;
    public onZoom?: (delta: number) => void;
    public onKeyDown?: (key: string) => void;
    public onKeyUp?: (key: string) => void;

    private isDragging: boolean = false;
    private lastX: number = 0;
    private lastY: number = 0;
    private totalDragDistance: number = 0;
    private readonly DRAG_THRESHOLD = 5;
    private pressedKeys: Set<string> = new Set();

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public start(): void {
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mousemove', this.onMouseMoveHandler);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.canvas.addEventListener('mouseleave', this.onMouseLeave);
        this.canvas.addEventListener('wheel', this.onWheel);

        window.addEventListener('keydown', this.onKeyDownHandler);
        window.addEventListener('keyup', this.onKeyUpHandler);
    }

    public stop(): void {
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mousemove', this.onMouseMoveHandler);
        this.canvas.removeEventListener('mouseup', this.onMouseUp);
        this.canvas.removeEventListener('mouseleave', this.onMouseLeave);
        this.canvas.removeEventListener('wheel', this.onWheel);

        window.removeEventListener('keydown', this.onKeyDownHandler);
        window.removeEventListener('keyup', this.onKeyUpHandler);
    }

    private getMousePos(event: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    private onMouseDown = (event: MouseEvent) => {
        this.isDragging = false;
        this.totalDragDistance = 0;
        const {x, y} = this.getMousePos(event);
        this.lastX = x;
        this.lastY = y;
    }

    private onMouseMoveHandler = (event: MouseEvent) => {
        const {x, y} = this.getMousePos(event);

        // Pass raw movement if needed
        if (this.onMouseMove) {
            this.onMouseMove(x, y);
        }

        // Handle Panning (Left click drag)
        // event.buttons & 1 checks if the primary button is held down
        if ((event.buttons & 1) === 1) {
            const dx = x - this.lastX;
            const dy = y - this.lastY;

            // If we moved, it's a drag
            if (dx !== 0 || dy !== 0) {
                this.totalDragDistance += Math.hypot(dx, dy);
                if (this.totalDragDistance > this.DRAG_THRESHOLD) {
                    this.isDragging = true;
                }
                if (this.onPan) {
                    this.onPan(dx, dy);
                }
            }
            
            this.lastX = x;
            this.lastY = y;
        }
    }

    private onMouseUp = (event: MouseEvent) => {
        // Only trigger click if we didn't drag
        if (!this.isDragging && this.onMouseClick) {
            const {x, y} = this.getMousePos(event);
            this.onMouseClick(x, y);
        }
        this.isDragging = false;
    }

    private onMouseLeave = () => {
        this.isDragging = false;
    }

    private onWheel = (event: WheelEvent) => {
        event.preventDefault();
        if (this.onZoom) {
            this.onZoom(event.deltaY);
        }
    }

    private onKeyDownHandler = (event: KeyboardEvent) => {
        this.pressedKeys.add(event.key);
        if (this.onKeyDown) {
            this.onKeyDown(event.key);
        }
    }

    private onKeyUpHandler = (event: KeyboardEvent) => {
        this.pressedKeys.delete(event.key);
        if (this.onKeyUp) {
            this.onKeyUp(event.key);
        }
    }

    public isKeyPressed(key: string): boolean {
        return this.pressedKeys.has(key);
    }

    public static handleMousePan(layoutSettings: LayoutSettings, dx: number, dy: number) {
        Logger.debug({dx, dy}, `Logic processing pan`);
        layoutSettings.origin.x += dx;
        layoutSettings.origin.y += dy;
    }

    public static handleMouseZoom(layoutSettings: LayoutSettings, delta: number) {
        // Zoom factor: 0.9 for zoom in, 1.1 for zoom out (inverted because wheel delta is usually negative for scroll up)
        const zoomFactor = delta > 0 ? 0.9 : 1.1;
        layoutSettings.size.x *= zoomFactor;
        layoutSettings.size.y *= zoomFactor;
    }

    // Other handlers will be located here.
}