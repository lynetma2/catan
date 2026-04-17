import { describe, it, expect, vi } from 'vitest';
import { FrameQueue } from './FrameQueue';
import { EventBus } from './EventBus';
import { GameEventSources } from '@/game/events/GameEventTypes';
import type { GameEvent } from '@/game/events/GameEventTypes';

describe('FrameQueue', () => {
    it('queues events and flushes them to the bus in order', () => {
        const queue = new FrameQueue();
        const bus = new EventBus();
        
        // Spy on the bus.emit method to verify calls
        const emitSpy = vi.spyOn(bus, 'emit');

        const event1: GameEvent<'DICE_ROLLED'> = {
            type: 'DICE_ROLLED',
            payload: { values: [1, 1], total: 2 },
            source: GameEventSources.World
        };
        
        const event2: GameEvent<'PLAYER_DISCONNECTED'> = {
            type: 'PLAYER_DISCONNECTED',
            payload: { playerId: 'p1' },
            source: GameEventSources.Network
        };

        // Push events to queue
        queue.push(event1);
        queue.push(event2);

        // Verify nothing has been emitted yet
        expect(emitSpy).not.toHaveBeenCalled();

        // Flush the queue
        queue.flush(bus);

        // Verify events were emitted in order
        expect(emitSpy).toHaveBeenCalledTimes(2);
        expect(emitSpy).toHaveBeenNthCalledWith(1, event1);
        expect(emitSpy).toHaveBeenNthCalledWith(2, event2);
    });

    it('clears the queue after flushing', () => {
        const queue = new FrameQueue();
        const bus = new EventBus();
        const emitSpy = vi.spyOn(bus, 'emit');

        queue.push({ type: 'TURN_STARTED', payload: { playerId: 'p1' }, source: GameEventSources.Network });
        
        queue.flush(bus);
        emitSpy.mockClear(); // Reset spy history

        queue.flush(bus); // Flush again (should be empty)
        expect(emitSpy).not.toHaveBeenCalled();
    });
});