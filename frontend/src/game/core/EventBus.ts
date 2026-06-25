type EventMap = Record<string, unknown>;

export type EventOf<
    TEvents extends EventMap,
    TType extends keyof TEvents
> = {
    type: TType;
    payload: TEvents[TType];
};

type Listener<T> = (payload: T) => void;

export class EventBus<TEvents extends EventMap> {
    private listeners = new Map<
        keyof TEvents,
        Set<Listener<any>>
    >();

    on<TKey extends keyof TEvents>(
        type: TKey,
        cb: Listener<TEvents[TKey]>
    ) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }

        this.listeners.get(type)!.add(cb);
    }

    off<TKey extends keyof TEvents>(
        type: TKey,
        cb: Listener<TEvents[TKey]>
    ) {
        this.listeners.get(type)?.delete(cb);
    }

    emit<TKey extends keyof TEvents>(
        event: EventOf<TEvents, TKey>
    ) {
        this.listeners
            .get(event.type)
            ?.forEach(cb => cb(event.payload));
    }
}