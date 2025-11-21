import { retry } from "../../../src/utils/retry.util";

jest.useFakeTimers();

describe("retry utility", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should wait between retries", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce("ok");

    const promise = retry(fn, 2, 1000);

    // Fast-forward through all timers
    await jest.runAllTimersAsync();

    const result = await promise;

    expect(fn).toHaveBeenCalledTimes(2);
    expect(result).toBe("ok");
  });

  it("should throw after all retries fail", async () => {
    const fn = jest.fn().mockRejectedValue(new Error("always fail"));

    const promise = retry(fn, 3, 500);

    // Attach rejection handler before running timers
    const expectPromise = expect(promise).rejects.toThrow("always fail");

    // Fast-forward through all timers
    await jest.runAllTimersAsync();

    await expectPromise;

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("should succeed immediately without retries", async () => {
    const fn = jest.fn().mockResolvedValue("success");

    const result = await retry(fn, 3, 1000);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe("success");
  });
});
