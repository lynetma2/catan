import { describe, it, expect, vi } from 'vitest';
import { EventBus } from './EventBus';
import { GameEventSources } from '@/game/events/GameEventTypes';
import type { GameEvent } from '@/game/events/GameEventTypes';

describe('EventBus', () => {
    it('subscribes and emits events to the correct listener', () => {
        const bus = new EventBus();
        const callback = vi.fn();

        // Subscribe to a specific event type
        bus.on('DICE_ROLLED', callback);

        const event: GameEvent<'DICE_ROLLED'> = {
            type: 'DICE_ROLLED',
            payload: { values: [3, 4], total: 7 },
            source: GameEventSources.World
        };

        bus.emit(event);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(event);
    });

    it('handles multiple listeners for the same event type', () => {
        const bus = new EventBus();
        const cb1 = vi.fn();
        const cb2 = vi.fn();

        bus.on('PLAYER_JOINED', cb1);
        bus.on('PLAYER_JOINED', cb2);

        bus.emit({
            type: 'PLAYER_JOINED',
            payload: { playerId: 'p1', name: 'Alice' },
            source: GameEventSources.Network
        });

        expect(cb1).toHaveBeenCalled();
        expect(cb2).toHaveBeenCalled();
    });

    it('does not trigger listeners for unrelated events', () => {
        const bus = new EventBus();
        const callback = vi.fn();

        bus.on('TURN_STARTED', callback);
        bus.emit({ type: 'TURN_ENDED', payload: { playerId: 'p1' }, source: GameEventSources.Network });

        expect(callback).not.toHaveBeenCalled();
    });
});