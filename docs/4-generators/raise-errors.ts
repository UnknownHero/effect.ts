import { Effect, Console } from "effect"

const task1 = Console.log("task1...")
const task2 = Console.log("task2...")

const program = Effect.gen(function* () {
    // Perform some tasks
    yield* task1
    yield* task2
    // Introduce an error
    return yield* Effect.fail("Something went wrong!")
})

Effect.runFork(program.pipe(
    Effect.tap((value) => Console.log(value)),
    Effect.catchAll((error) => Console.error(error))
))
/*
Output:
task1...
task2...
(FiberFailure) Error: Something went wrong!
*/


type User = {
    readonly name: string
}

declare function getUserById(id: string): Effect.Effect<User | undefined>

function greetUser(id: string) {
    return Effect.gen(function* () {
        const user = yield* getUserById(id)

        if (user === undefined) {
            // Explicitly return after failing
            return yield* Effect.fail(`User with id ${id} not found`)
        }

        // Now TypeScript knows that 'user' is not undefined
        return `Hello, ${user.name}!`
    })
}