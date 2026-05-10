import { Data, Effect } from "effect"

export class JsonParseError extends Data.TaggedError("JsonParseError")<{
    readonly cause: Error
    readonly input: string
}> {}

const parse = (input: string) =>
    Effect.try({
        try: () => JSON.parse(input) as unknown,
        catch: (cause) =>
            new JsonParseError({
                cause: cause instanceof Error ? cause : new Error(String(cause)),
                input,
            }),
    })

const program = parse("").pipe(
    Effect.tap((result) =>
        Effect.log(`Parsed JSON: ${JSON.stringify(result)}`),
    ),
    Effect.catchTag("JsonParseError", (err) =>
        Effect.logError(
            `Cannot parse JSON (input=${JSON.stringify(err.input)}): ${err.cause.message}`,
        ),
    ),
)

await Effect.runPromise(program)