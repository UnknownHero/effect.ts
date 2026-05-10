import {pipe, Effect, Option, Either} from "effect"

// Function to apply a discount safely to a transaction amount
const applyDiscount = (
    total: number,
    discountRate: number
): Effect.Effect<number, Error> =>
    discountRate === 0
        ? Effect.fail(new Error("Discount rate cannot be zero"))
        : Effect.succeed(total - (total * discountRate) / 100)

// Simulated asynchronous task to fetch a transaction amount from database
const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))

// Using Effect.map and Effect.flatMap
const result1 = pipe(
    fetchTransactionAmount,
    Effect.map((amount) => amount * 2),
    Effect.flatMap((amount) => applyDiscount(amount, 5))
)

Effect.runPromise(result1).then(console.log) // Output: 190

// Using Effect.andThen
const result2 = pipe(
    fetchTransactionAmount,
    Effect.andThen((amount) => amount * 2),
    Effect.andThen((amount) => applyDiscount(amount, 5))
)

Effect.runPromise(result2).then(console.log) // Output: 190

// example with type

// Simulated asynchronous task fetching a number from a database
const fetchNumberValue = Effect.tryPromise(() => Promise.resolve(42))

//      ┌─── Effect<number, UnknownException | NoSuchElementException, never>
//      ▼
const program = pipe(
    fetchNumberValue,
    Effect.andThen((x) => (x > 0 ? Option.some(x) : Option.none()))
)

Effect.runPromise(program).then(console.log)

//  example 3

// Function to parse an integer from a string that can fail
const parseInteger = (input: string): Either.Either<number, string> =>
    isNaN(parseInt(input))
        ? Either.left("Invalid integer")
        : Either.right(parseInt(input))

// Simulated asynchronous task fetching a string from database
const fetchStringValue = Effect.tryPromise(() => Promise.resolve("42"))

//      ┌─── Effect<number, string | UnknownException, never>
//      ▼
const programAgain = pipe(
    fetchStringValue,
    Effect.andThen((str) => parseInteger(str))
)

Effect.runPromise(programAgain).then(console.log);
