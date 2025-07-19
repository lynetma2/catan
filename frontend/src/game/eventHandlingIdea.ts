import type {MouseEvent} from "react";

//Should maybe have the canvas as an internal field.
//Keep size etc as fields.
interface Button {
    draw(canvas: HTMLCanvasElement): void;
    onClick(e: MouseEvent, canvas: HTMLCanvasElement, callback:() => void): void; //Should redraw itself
    onHover(e: MouseEvent, canvas: HTMLCanvasElement, callback:() => void): void; //Should redraw itself
}