import type {Tool} from "@/game/state/tool/Tool.ts";
import type {GameState, GhostEffect, HUDEntities} from "@/game/model/types.ts";

export interface Phase {
    activeTools: Tool[];
    availableTools: Tool[];
    globalGame: GameState;
    globalHUD: HUDEntities;

    //Initialize and deinitialize the phase (Should update the global HUD state, primarely the buttons disabled or enabled states)
    onEnter(game: GameState, hudEntities: HUDEntities): void;
    onExit(game: GameState, hudEntities: HUDEntities): void;

    //Methods needed for tool handling (Allowed actions)
    setActiveTool(tool: Tool | null): void;
    getActiveTools(): Tool[];

    //Methods needed for inputHandling
    onClick(x: number, y: number): void; //Should be updated to inputEvent, to avoid needing the layoutSettings
    onMouseMove(x: number, y: number): void; //Should be updated to inputEvent

    //Methods needed for rendering
    getGhostEffects(): GhostEffect[];
}