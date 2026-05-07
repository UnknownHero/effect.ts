import { Data, Effect, Logger, LogLevel, Match } from "effect"
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api"
import { TelemetryLive } from "../telemetry.ts"

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR)

export class DivisionByZeroError extends Data.TaggedError(
    "DivisionByZeroError",
)<{
    readonly a: number
}> {}

export class UnluckyNumberError extends Data.TaggedError(
    "UnluckyNumberError",
)<{
    readonly a: number
}> {}

export const divide = (
    a: number,
    b: number,
): Effect.Effect<number, DivisionByZeroError | UnluckyNumberError> =>
    Match.value({ a, b }).pipe(
        Match.when({ a: 13 }, ({ a }) =>
            Effect.fail(new UnluckyNumberError({ a })),
        ),
        Match.when({ b: 0 }, ({ a }) =>
            Effect.fail(new DivisionByZeroError({ a })),
        ),
        Match.orElse(({ a, b }) => Effect.succeed(a / b)),
    )

const program: Effect.Effect<number | void, never, never> = divide(13, 2).pipe(
    Effect.tap((result) => Effect.log(`Division result: ${result}`)),
    Effect.catchTags({
        DivisionByZeroError: (err) =>
            Effect.logError(`Cannot divide ${err.a} by zero`),
        UnluckyNumberError: (err) =>
            Effect.logError(`${err.a} is unlucky, refusing to divide`),
    }),
    // Effect.catchAllCause((err) =>
    //     Effect.logError(`Unhandled error: ${String(err)}`),
    // ),
    Effect.provide(TelemetryLive),
    Logger.withMinimumLogLevel(LogLevel.Debug),
)

await Effect.runPromise(program)