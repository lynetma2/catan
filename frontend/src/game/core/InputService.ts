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

    private isDragging: boolean = false;
    private lastX: number = 0;
    private lastY: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public start(): void {
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mousemove', this.onMouseMoveHandler);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.canvas.addEventListener('mouseleave', this.onMouseLeave);
        this.canvas.addEventListener('wheel', this.onWheel);
    }

    public stop(): void {
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mousemove', this.onMouseMoveHandler);
        this.canvas.removeEventListener('mouseup', this.onMouseUp);
        this.canvas.removeEventListener('mouseleave', this.onMouseLeave);
        this.canvas.removeEventListener('wheel', this.onWheel);
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
                this.isDragging = true;
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

    // --- STATIC LOGIC HANDLER ---
    // This keeps the logic out of catan.ts, but allows catan.ts to inject the state.
    public static handleMouseClick(gameState: GameState, x: number, y: number) {
        Logger.debug({x, y}, `Logic processing click`);
    }

    public static handleMouseMovement(gameState: GameState, layoutSettings: LayoutSettings, x: number, y: number) {
        gameState.inputState.mousePosition = {x, y};

        // Example: If we are in the "Build Road" phase
        // const isBuildingRoad = gameState.phase === GamePhase.BuildRoad; 
        const isBuildingRoad = true; // Hardcoded for demo

        if (isBuildingRoad) {
            // 1. Snap: Calculate nearest edge
            // const nearestEdge = HexLayoutService.getNearestEdge(layoutSettings, {x, y});
            
            // Mocking a result for demonstration
            const nearestEdge = { q: 0, r: 0, direction: 1 }; 

            gameState.inputState.potentialMove = {
                moveType: MoveType.Road,
                location: nearestEdge,
                isValid: true // Check BoardService.canPlaceRoad(...) here
            };
        }
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