import { Effect, pipe } from "effect"

// Example 1

// A simple Effect that succeeds with a number
const myEffect: Effect.Effect<number, never, never> = Effect.succeed(10)

// A pure transformation function
const transformation = (n: number): string => `Value is: ${n * 2}`

// ─────────────────────────────────────────────────────────────
// Style 1: pipe() utility — data-first via pipe
// ─────────────────────────────────────────────────────────────
const mapped1 = pipe(myEffect, Effect.map(transformation))

// ─────────────────────────────────────────────────────────────
// Style 2: Direct call — data-first arguments
// ─────────────────────────────────────────────────────────────
const mapped2 = Effect.map(myEffect, transformation)

// ─────────────────────────────────────────────────────────────
// Style 3: .pipe() method on the Effect itself
// ─────────────────────────────────────────────────────────────
const mapped3 = myEffect.pipe(Effect.map(transformation))

// ─────────────────────────────────────────────────────────────
// Run all three to prove they're equivalent
// ─────────────────────────────────────────────────────────────
const program = Effect.gen(function* () {
    const r1 = yield* mapped1
    const r2 = yield* mapped2
    const r3 = yield* mapped3

    console.log("Style 1 (pipe util):    ", r1)
    console.log("Style 2 (direct call):  ", r2)
    console.log("Style 3 (.pipe method): ", r3)
    console.log("All equal:              ", r1 === r2 && r2 === r3)
})

Effect.runPromise(program)

// Example 2

// Function to add a small service charge to a transaction amount
const addServiceCharge = (amount: number) => amount + 1

// Simulated asynchronous task to fetch a transaction amount from database
const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))

// Apply service charge to the transaction amount
const finalAmount = pipe(
    fetchTransactionAmount,
    Effect.map(addServiceCharge)
)

Effect.runPromise(finalAmount).then(console.log) // Output: 101