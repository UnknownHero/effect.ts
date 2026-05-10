import {Console, Effect, Option, Random} from "effect"

// Function to validate weight or fail with an error
const validateWeightOrFail = (
    weight: number
): Effect.Effect<number, string> => {
    if (weight >= 0) {
        // Return the weight if valid
        return Effect.succeed(weight)
    } else {
        // Fail with an error if invalid
        return Effect.fail(`negative input: ${weight}`)
    }
}

// // Function to validate weight and return an Option
// const validateWeightOption = (
//     weight: number
// ): Effect.Effect<Option.Option<number>> => {
//     if (weight >= 0) {
//         // Return Some if the weight is valid
//         return Effect.succeed(Option.some(weight))
//     } else {
//         // Return None if the weight is invalid
//         return Effect.succeed(Option.none())
//     }
// }

const flipTheCoin = Effect.if(Random.nextBoolean, {
    onTrue: () => Console.log("Head"), // Runs if the predicate is true
    onFalse: () => Console.log("Tail") // Runs if the predicate is false
})

Effect.runFork(flipTheCoin)

const validateWeightOption = (
    weight: number
): Effect.Effect<Option.Option<number>> =>
    // Conditionally execute the effect if the weight is non-negative
    Effect.succeed(weight).pipe(Effect.when(() => weight >= 0))

// Run with a valid weight
Effect.runPromise(validateWeightOption(100)).then(console.log)
/*
Output:
{
  _id: "Option",
  _tag: "Some",
  value: 100
}
*/

// Run with an invalid weight
Effect.runPromise(validateWeightOption(-5)).then(console.log)
/*
Output:
{
  _id: "Option",
  _tag: "None"
}
*/

const randomIntOption = Random.nextInt.pipe(
    Effect.whenEffect(Random.nextBoolean)
)

console.log('randomIntOption', Effect.runSync(randomIntOption))
/*
Example Output:
{ _id: 'Option', _tag: 'Some', value: 8609104974198840 }
*/