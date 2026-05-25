export type EventUnion<T> = {
    [K in keyof T]: {
        type: K;
        payload: T[K];
    }
}[keyof T];

export type Values<T> = T[keyof T];

export type DeepValues<T> =
    T extends string
        ? T
        : T extends object
            ? DeepValues<T[keyof T]>
            : never;

export type EventsFromGroup<TUnion, TGroup> =
    Extract<TUnion, {
        type: DeepValues<TGroup>;
    }>;

export function assertNever(value: never): never {
    throw new Error(
        `Unhandled event: ${JSON.stringify(value)}`
    );
}

export type EventByType<TEvent extends { type: string }> = {
    [E in TEvent as E["type"]]: E;
};