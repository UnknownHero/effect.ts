import { Effect, Fiber } from "effect"

// A task that supports interruption using AbortSignal
const interruptibleTask = Effect.async<void, Error>((resume, signal) => {
    // Simulate a long-running task
    const timeoutId = setTimeout(() => {
        console.log("Operation completed")
        resume(Effect.void)
    }, 2000)

    // Handle interruption
    signal.addEventListener("abort", () => {
        console.log("Abort signal received")
        clearTimeout(timeoutId)
    })
})

const program = Effect.gen(function* () {
    const fiber = yield* Effect.fork(interruptibleTask)
    // Simulate interrupting the fiber after 1 second
    yield* Effect.sleep("1 second")
    yield* Fiber.interrupt(fiber)
})

// Run the program
Effect.runPromise(program)
/*
Output:
Abort signal received
*/