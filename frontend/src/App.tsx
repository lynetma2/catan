import {useEffect, useRef, useState} from 'react';
import './App.css';
import {Game} from "@/game/core/Game.ts";
import {useParams} from "react-router";
import {useWebSocket} from "@/WebSocketContext.ts";
import {GameServerEvents} from "@/events/game/GameServerEvents.ts";
import {GameActionEvents} from "@/events/game/GameActionEvents.ts";
import {type EndGameSummary, GamePhase, type GameSnapshot} from "@/game/core/types.ts";
import {EndScreen} from "@/game/hud/react/EndScreen.tsx";
import type {GameEventMap} from "@/events/shared/AppEvents.ts"; // Your React component

function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameLoopRef = useRef<Game | null>(null);
    const ws = useWebSocket();
    const { gameId } = useParams<{ gameId: string }>();
    const localPlayerId = sessionStorage.getItem('playerId');

    const [endGameData, setEndGameData] = useState<EndGameSummary | null>(null);
    const endSummaryRequestedRef = useRef<boolean | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !gameId || !localPlayerId) return;

        const game = new Game(canvas, ws, gameId, localPlayerId);
        gameLoopRef.current = game;
        game.start();

        const bus = game.getEventBus();

        const requestEndSummary = () => {
            if (endSummaryRequestedRef.current) return;

            endSummaryRequestedRef.current = true;

            bus.emit({
                type: GameActionEvents.endSummary,
                payload: {},
            });
        };

        // Live game: phase transitions to End
        const handlePhaseChange = (payload: { phase: GamePhase }) => {
            if (payload.phase === GamePhase.End) requestEndSummary();
        };

        // Refresh / reconnect: only the full snapshot arrives, no phase.change event
        const handleFullState = (payload: { snapshot: GameSnapshot }) => {
            if (payload.snapshot.currentPhase === GamePhase.End) requestEndSummary();
        };

        const handleEndGame = (payload: GameEventMap[typeof GameServerEvents.state.end.success]) => {
            setEndGameData(payload.endSummary);
        };

        bus.on(GameServerEvents.state.phase.change.success, handlePhaseChange);
        bus.on(GameServerEvents.state.full.success, handleFullState);
        bus.on(GameServerEvents.state.end.success, handleEndGame);

        return () => {
            bus.off(GameServerEvents.state.phase.change.success, handlePhaseChange);
            bus.off(GameServerEvents.state.full.success, handleFullState);
            bus.off(GameServerEvents.state.end.success, handleEndGame);
            game.destroy();
        };
    }, [gameId, localPlayerId, ws]);

    return (
        // Parent container needs 'relative' so the absolute overlay positions correctly
        <div style={{width: '1000px', height: '1000px', position: 'relative'}}>
            <canvas
                tabIndex={0}
                ref={canvasRef}
                style={{ display: 'block', width: '100%', height: '100%' }}
            />

            {/* Render the React Overlay when data arrives */}
            {endGameData && (
                <EndScreen
                    data={endGameData}
                    localPlayerId={localPlayerId}
                    onClose={() => {
                        setEndGameData(null);
                    }}
                />
            )}
        </div>
    );
}

export default App;