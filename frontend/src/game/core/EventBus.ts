import type {GameEvent, GameEventType} from "@/game/events/GameEventTypes.ts";

// 1. Define an explicit signature instead of 'Function'
type GenericEventListener = (event: any) => void;

export class EventBus {
    // 2. Use your new type in the Map
    private readonly listeners = new Map<GameEventType, Set<GenericEventListener>>();

    on<T extends GameEventType>(type: T, cb: (e: GameEvent<T>) => void) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        // 3. Cast the strongly-typed callback to the generic one
        this.listeners.get(type)!.add(cb as GenericEventListener);
    }

    emit<T extends GameEventType>(event: GameEvent<T>) {
        this.listeners.get(event.type)?.forEach(cb => cb(event));
    }

    off<T extends GameEventType>(type: T, cb: (e: GameEvent<T>) => void) {
        this.listeners.get(type)?.delete(cb as GenericEventListener);
    }
}