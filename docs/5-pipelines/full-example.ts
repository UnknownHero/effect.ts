import {Console, Effect} from "effect"

const addServiceCharge = (amount: number) => amount + 1

const applyDiscount = (
    total: number,
    discountRate: number
): Effect.Effect<number, Error> =>
    discountRate === 0
        ? Effect.fail(new Error("Discount rate cannot be zero"))
        : Effect.succeed(total - (total * discountRate) / 100)

const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))

const fetchDiscountRate = Effect.promise(() => Promise.resolve(5))

const program = Effect.all([
    fetchTransactionAmount,
    fetchDiscountRate
]).pipe(
    Effect.andThen(([transactionAmount, discountRate]) =>
        applyDiscount(transactionAmount, discountRate)
    ),
    Effect.andThen(addServiceCharge),
    Effect.andThen(
        (finalAmount) => `Final amount to charge: ${finalAmount}`
    )
)

Effect.runFork(program.pipe(Effect.tap(value=> Console.log(value))))