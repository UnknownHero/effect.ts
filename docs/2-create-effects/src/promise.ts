import { Effect } from "effect"

const delay = (message: string) =>
    Effect.promise<string>(
        () =>
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve(message)
                }, 2000)
            })
    )

//      ┌─── Effect<string, never, never>
//      ▼
const program = delay("Async operation completed successfully!").pipe(
    Effect.tap((result) =>Effect.log(result))
)

await Effect.runPromise(program)