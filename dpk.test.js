const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  test("should return a trivial partition key when event is undefined", () => {
    const expected = "0";
    const result = deterministicPartitionKey(undefined);
    expect(result).toEqual(expected);
  });

  test("should return a trivial partition key when event is null", () => {
    const expected = "0";
    const result = deterministicPartitionKey(null);
    expect(result).toEqual(expected);
  });

  test("should return the event partition key when it is defined", () => {
    const event = { partitionKey: "abc" };
    const expected = "abc";
    const result = deterministicPartitionKey(event);
    expect(result).toEqual(expected);
  });

  test("should hash the event JSON when partition key is undefined", () => {
    const event = { a: 1, b: "two", c: [3, 4, 5] };
    const data = JSON.stringify(event);
    const expected = crypto.createHash("sha3-512").update(data).digest("hex");
    const result = deterministicPartitionKey(event);
    expect(result).toEqual(expected);
  });

  test("should convert non-string partition key to a string", () => {
    const event = { partitionKey: 123 };
    const expected = "123";
    const result = deterministicPartitionKey(event);
    expect(result).toEqual(expected);
  });

  test("should hash the partition key when it is too long", () => {
    const longKey = "a".repeat(300);
    const expected = crypto.createHash("sha3-512").update(longKey).digest("hex");
    const event = { partitionKey: longKey };
    const result = deterministicPartitionKey(event);
    expect(result).toEqual(expected);
  });
});

