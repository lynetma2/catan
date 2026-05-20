export function namespace<
    TPrefix extends string
>(
    prefix: TPrefix
) {

    return <
        T extends Record<string, string>
    >(events: T) => {

        return Object.fromEntries(
            Object.entries(events).map(
                ([key, value]) => [
                    key,
                    `${prefix}.${value}`,
                ]
            )
        ) as {
            [K in keyof T]:
            `${TPrefix}.${T[K]}`
        };
    };
}