// src/examples/read-file.ts
import { Effect } from "effect"
import * as NodeFS from "node:fs"

const readFile = (filename: string) =>
    Effect.async<Buffer, Error>((resume) => {
        NodeFS.readFile(filename, (error, data) => {
            if (error) {
                resume(Effect.fail(error))
            } else {
                resume(Effect.succeed(data))
            }
        })
    })

const program = readFile("example.txt").pipe(
    Effect.tap((buf) => Effect.log(`Read ${buf.length} bytes`)),
    Effect.tap((buf) => Effect.log(`Content: ${buf.toString("utf8")}`)),
    Effect.catchAll((err) => Effect.logError(`Failed: ${err.message}`)),
)

await Effect.runPromise(program)