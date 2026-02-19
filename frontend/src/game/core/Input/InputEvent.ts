// types/InputEvent.ts

import type {Vec2} from "@/game/utils/Vec2.ts";

export type NormalizedInputEvent =
    | MouseMoveEvent
    | MouseClickEvent
    | MouseDownEvent
    | MouseUpEvent
    | WheelEvent
    | KeyDownEvent
    | KeyUpEvent;

interface MouseMoveEvent {
    type: 'mousemove';
    screenPos: Vec2;
}

interface MouseClickEvent {
    type: 'click';
    screenPos: Vec2;
    button: 'left' | 'right' | 'middle';
}

interface MouseDownEvent {
    type: 'mousedown';
    screenPos: Vec2;
    button: 'left' | 'right' | 'middle';
}

interface MouseUpEvent {
    type: 'mouseup';
    screenPos: Vec2;
    button: 'left' | 'right' | 'middle';
}

interface WheelEvent {
    type: 'wheel';
    screenPos: Vec2;
    delta: number; // normalized — not the raw deltaY which varies by browser/OS
}

interface KeyDownEvent {
    type: 'keydown';
    key: GameKey;
}

interface KeyUpEvent {
    type: 'keyup';
    key: GameKey;
}

// Only the keys that the game actually cares about
export type GameKey = 'escape' | 'enter' | 'r' | 'b' | 'c';