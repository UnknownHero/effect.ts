import { Effect } from "effect"

const program = Effect.sync(() => {
    console.log("Hello, World!")
    return 1
})

const result = Effect.runSync(program)
// Output: Hello, World!

console.log(result)
// Output: 1


try {
    // Attempt to run an effect that fails
    Effect.runSync(Effect.fail("my error"))
} catch (e) {
    console.error(e)
}
/*
Output:
(FiberFailure) Error: my error
*/

try {
    // Attempt to run an effect that involves async work
    Effect.runSync(Effect.promise(() => Promise.resolve(1)))
} catch (e) {
    console.error(e)
}
/*
Output:
(FiberFailure) AsyncFiberException: Fiber #0 cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work
*/

console.log(Effect.runSyncExit(Effect.succeed(1)))
/*
Output:
{
  _id: "Exit",
  _tag: "Success",
  value: 1
}
*/

console.log(Effect.runSyncExit(Effect.fail("my error")))
/*
Output:
{
  _id: "Exit",
  _tag: "Failure",
  cause: {
    _id: "Cause",
    _tag: "Fail",
    failure: "my error"
  }
}
*/

console.log(Effect.runSyncExit(Effect.promise(() => Promise.resolve(1))))
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Die',
    defect: [Fiber #0 cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work] {
      fiber: [FiberRuntime],
      _tag: 'AsyncFiberException',
      name: 'AsyncFiberException'
    }
  }
}
*/