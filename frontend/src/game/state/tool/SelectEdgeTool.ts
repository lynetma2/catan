import type {Tool} from "@/game/state/tool/Tool.ts";
import type {Edge, GameState, GhostEffect, LayoutSettings} from "@/game/model/types.ts";
import type {InputEvent} from "react";
import type {GameContext} from "@/game/state/GameStateHandler.ts";
import {HexLayoutService} from "@/game/layout/HexLayoutService.ts";

/*
    Hovers the edge closest to the mouse if valid.
 */
export class SelectEdgeTool implements Tool {
    readonly name: string = "SelectEdgeTool";
    public circleHover: boolean;
    private hoveredEdge: Edge | undefined;


    onEnter(game: GameState): void {
        //Precondition only valid player can choose this tool
    }

    onExit(game: GameState): void {
        //Postcondition clean the class
    }

    onInputEvent(event: InputEvent, game: GameState, layout: LayoutSettings, context: GameContext): void {

    }

    onAction(event: InputEvent, game: GameState, layout: LayoutSettings, context: GameContext): void {
    }

    getGhostEffect(): GhostEffect | undefined {
        return undefined;
    }

    private onMouseMove(event: MouseEvent, layout: LayoutSettings, game: GameState): void {
        const nearestEdge = HexLayoutService.getNearestEdge();
    }
}