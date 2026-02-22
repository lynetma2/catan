// dev/testData.ts
import { type EventPayloads } from '@/game/events/GameEventTypes';

export function createTestGameState(
    playerCount: 2 | 3 | 4 = 4
): EventPayloads['GAME_STATE_LOADED'] {
    const players = [
        { id: 'p1', name: 'Alice',  color: '#e05050', victoryPoints: 5, cardCount: 3, devCardCount: 1, hasLongestRoad: true,  hasLargestArmy: false, usedRobbers: 1 },
        { id: 'p2', name: 'Bob',    color: '#50a0e0', victoryPoints: 3, cardCount: 7, devCardCount: 0, hasLongestRoad: false, hasLargestArmy: true,  usedRobbers: 2 },
        { id: 'p3', name: 'Carol',  color: '#50c050', victoryPoints: 4, cardCount: 1, devCardCount: 2, hasLongestRoad: false, hasLargestArmy: false, usedRobbers: 0 },
        { id: 'p4', name: 'Dave',   color: '#e0a030', victoryPoints: 1, cardCount: 0, devCardCount: 0, hasLongestRoad: false, hasLargestArmy: false, usedRobbers: 0 },
    ].slice(0, playerCount);

    return {
        players,
        placements:      { roads: [], settlements: [], cities: [] },
        currentPhase:    'building',
        currentPlayerId: 'p1',
        turnNumber:      7,
    };
}