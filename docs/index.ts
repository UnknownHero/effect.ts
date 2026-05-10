// index.ts
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api"
import { Effect, Logger, LogLevel } from "effect"
import { TelemetryLive } from "./telemetry"

// 1. OTel SDK internal errors (trace + metric exporter failures)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR)

const program = Effect.log("Hello!").pipe(
    Effect.delay(2000),
    Effect.withSpan("Hi", { attributes: { foo: "bar" } }),
    Effect.forever,
)

program.pipe(
    Effect.provide(TelemetryLive),
    Logger.withMinimumLogLevel(LogLevel.Debug),
    Effect.runFork,
)