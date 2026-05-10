import { Effect, Console, Schedule, Fiber } from "effect"

//      ┌─── Effect<number, never, never>
//      ▼
const program = Effect.repeat(
    Console.log("running..."),
    Schedule.spaced("100 millis")
)

//      ┌─── RuntimeFiber<number, never>
//      ▼
const fiber = Effect.runFork(program)

setTimeout(() => {
    Effect.runFork(Fiber.interrupt(fiber))
}, 500)