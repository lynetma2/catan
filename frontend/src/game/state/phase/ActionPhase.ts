import type {Phase} from "@/game/state/phase/Phase.ts";
import type {Tool} from "@/game/state/tool/Tool.ts";
import type {GameState, GhostEffect, HUDEntities} from "@/game/model/types.ts";

export class ActionPhase implements Phase {
    private readonly tools: Tool[];
    activeTools: Tool[];
    availableTools: Tool[];

    getActiveTools(): Tool[] {
        return [];
    }

    getGhostEffects(): GhostEffect[] {
        return [];
    }

    onClick(x: number, y: number): void {
    }

    onEnter(game: GameState, hudEntities: HUDEntities): void {
    }

    onExit(game: GameState, hudEntities: HUDEntities): void {
    }

    onMouseMove(x: number, y: number): void {
    }

    setActiveTool(tool: Tool | null): void {
    }

}