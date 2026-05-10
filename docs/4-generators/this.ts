import { Effect } from "effect"

class MyClass {
    readonly local = 1
    compute = Effect.gen(this, function* () {
        const n = this.local + 1

        yield* Effect.log(`Computed value: ${n}`)

        return n
    })
}

Effect.runPromise(new MyClass().compute).then(console.log)
/*
Output:
timestamp=... level=INFO fiber=#0 message="Computed value: 2"
2
*/