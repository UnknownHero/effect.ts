import { Effect } from "effect"

const task1 = Effect.succeed(1).pipe(
    Effect.delay("200 millis"),
    Effect.tap(Effect.log("task1 done"))
)

const task2 = Effect.succeed("hello").pipe(
    Effect.delay("100 millis"),
    Effect.tap(Effect.log("task2 done"))
)

// Combine the two effects together
//
//      ┌─── Effect<[number, string], never, never>
//      ▼
const program = Effect.zip(task1, task2)

Effect.runPromise(program).then(console.log)
/*
Output:
timestamp=... level=INFO fiber=#0 message="task1 done"
timestamp=... level=INFO fiber=#0 message="task2 done"
[ 1, 'hello' ]
*/

// Run both effects concurrently using the concurrent option
const program2 = Effect.zip(task1, task2, { concurrent: true })

Effect.runPromise(program2).then(console.log)
/*
Output:
timestamp=... level=INFO fiber=#3 message="task2 done"
timestamp=... level=INFO fiber=#2 message="task1 done"
[ 1, 'hello' ]
*/

//      ┌─── Effect<number, never, never>
//      ▼
const task3 = Effect.zipWith(
    task1,
    task2,
    // Combines results into a single value
    (number, string) => number + string.length
)

Effect.runPromise(task3).then(value => console.log('task3',value))
/*
Output:
timestamp=... level=INFO fiber=#3 message="task1 done"
timestamp=... level=INFO fiber=#2 message="task2 done"
6
*/