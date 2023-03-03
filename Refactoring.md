# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here
 The original code looks like this:
 
 ````js
 const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate;

  if (event) {
    if (event.partitionKey) {
      candidate = event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      candidate = crypto.createHash("sha3-512").update(data).digest("hex");
    }
  }

  if (candidate) {
    if (typeof candidate !== "string") {
      candidate = JSON.stringify(candidate);
    }
  } else {
    candidate = TRIVIAL_PARTITION_KEY;
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }
  return candidate;
};
````


The first step in refactoring this code is to simplify the logic and remove unnecessary nested if statements. I did this by using optional chaining to safely access the partitionKey property of the event object:

````js
const crypto = require("crypto");


function deterministicPartitionKey(event) {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  let candidate =  event?.partitionKey;
  if (event && !candidate) {
    const data = JSON.stringify(event);
    candidate = crypto.createHash("sha3-512")
                      .update(data).digest("hex");
  }

  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }

  if (candidate && candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }

  return candidate || TRIVIAL_PARTITION_KEY;
}

module.exports = { deterministicPartitionKey };
````

In this refactored code, we use optional chaining to assign the value of event.partitionKey to candidate if it exists. If event.partitionKey is falsy or doesn't exist, we fall back to generating a deterministic partition key using a SHA-3 512-bit hash of the event object.

We also remove the nested if statements by using an if statement to check if candidate is not a string and converting it to a string using JSON.stringify if necessary. Finally, we add a check to make sure candidate is defined before checking its length and generating a hash if necessary.

Additionally, we include a fallback to the TRIVIAL_PARTITION_KEY value in case candidate is falsy. This is to ensure that the function always returns a valid partition key, even if the input is undefined, null, or an empty object.

I hope this explanation helps! Let me know if you have any further questions.
