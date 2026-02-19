// types/InputEvent.ts

import type {Vec2} from "@/game/utils/Vec2.ts";

export enum MouseButton {
    Left = 'left',
    Right = 'right',
    Middle = 'middle',
}

// Only the keys that the game actually cares about
export enum GameKey {
    Escape = "escape",
    Enter = "enter",
    R = "r",
    B = "b",
    C = "c",
}

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
    button: MouseButton;
}

interface MouseDownEvent {
    type: 'mousedown';
    screenPos: Vec2;
    button: MouseButton;
}

interface MouseUpEvent {
    type: 'mouseup';
    screenPos: Vec2;
    button: MouseButton;
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

