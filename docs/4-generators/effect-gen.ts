import {Brand, Console, Data, Effect, Either, Match} from "effect"

// Function to add a small service charge to a transaction amount
const addServiceCharge = (amount: number) => amount + 1
const validateRate = (rate: number): Effect.Effect<number, Error> =>
    Match.value(rate).pipe(
        Match.when(0, () => Effect.fail(new Error("Cannot be zero"))),
        Match.when(
            (r: number) => r > 100,
            () => Effect.fail(new Error("Cannot be > 100"))
        ),
        Match.orElse((r) => Effect.succeed(r))
    )

const calculateDiscount = (total: number) => (rate: number) =>
    total - (total * rate) / 100

const applyDiscount = (total: number, rate: number) =>
    validateRate(rate).pipe(Effect.map(calculateDiscount(total)))

// Simulated asynchronous task to fetch a transaction amount from a
// database
const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))

// Simulated asynchronous task to fetch a discount rate from a
// configuration file
const fetchDiscountRate = Effect.promise(() => Promise.resolve(50))

// Assembling the program using a generator function
const program = Effect.gen(function* () {
    // Retrieve the transaction amount and the discount rate
    const [transactionAmount, discountRate] = yield* Effect.all(
        [fetchTransactionAmount, fetchDiscountRate],
        { concurrency: "unbounded" }
    )

    // Calculate discounted amount
    const discountedAmount = yield* applyDiscount(
        transactionAmount,
        discountRate
    )

    // Apply service charge
    const finalAmount = addServiceCharge(discountedAmount)

    // Return the total amount after applying the charge
    return `Final amount to charge: ${finalAmount}`
})

// Execute the program and log the result
Effect.runFork(program.pipe(
    Effect.tap(result => Console.log(result)),
    Effect.catchAll(error => Console.log(error))
))
// Output: Final amount to charge: 96