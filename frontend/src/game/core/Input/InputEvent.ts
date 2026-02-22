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

export enum InputType {
    MouseMove = 'mousemove',
    MouseClick = 'click',
    MouseDown = 'mousedown',
    MouseUp = 'mouseup',
    Wheel = 'wheel',
    KeyDown = 'keydown',
    KeyUp = 'keyup',
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
    type: InputType.MouseMove;
    screenPos: Vec2;
}

interface MouseClickEvent {
    type: InputType.MouseClick;
    screenPos: Vec2;
    button: MouseButton;
}

interface MouseDownEvent {
    type: InputType.MouseDown;
    screenPos: Vec2;
    button: MouseButton;
}

interface MouseUpEvent {
    type: InputType.MouseUp;
    screenPos: Vec2;
    button: MouseButton;
}

interface WheelEvent {
    type: InputType.Wheel;
    screenPos: Vec2;
    delta: number; // normalized — not the raw deltaY which varies by browser/OS
}

interface KeyDownEvent {
    type: InputType.KeyDown;
    key: GameKey;
}

interface KeyUpEvent {
    type: InputType.KeyUp;
    key: GameKey;
}

