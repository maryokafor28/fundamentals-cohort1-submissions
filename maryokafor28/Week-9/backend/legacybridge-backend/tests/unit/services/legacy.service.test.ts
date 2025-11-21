import { LegacyService } from "../../../src/services/legacy.service";

jest.useFakeTimers(); // required for retry delays

const fakeAxiosInstance = {
  get: jest.fn(),
};

describe("LegacyService", () => {
  let service: LegacyService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LegacyService(fakeAxiosInstance as any);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("fetchPayments() → should return data on success", async () => {
    fakeAxiosInstance.get.mockResolvedValueOnce({
      data: [{ id: 1, amount: 100 }],
    });

    const result = await service.fetchPayments();

    expect(fakeAxiosInstance.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: 1, amount: 100 }]);
  });

  it("fetchPayments() → should retry once then succeed", async () => {
    fakeAxiosInstance.get
      .mockRejectedValueOnce(new Error("Network fail"))
      .mockResolvedValueOnce({ data: [{ id: 99 }] });

    const promise = service.fetchPayments();

    // Fast-forward through all timers
    await jest.runAllTimersAsync();

    const result = await promise;

    expect(fakeAxiosInstance.get).toHaveBeenCalledTimes(2);
    expect(result).toEqual([{ id: 99 }]);
  });

  it("fetchPaymentById() → should throw LegacyError after retries fail", async () => {
    fakeAxiosInstance.get.mockRejectedValue(new Error("Bad Error"));

    const promise = service.fetchPaymentById(123);

    // Attach rejection handler BEFORE running timers
    const expectPromise = expect(promise).rejects.toThrow("Legacy API Error");

    // Fast-forward through all retry timers
    await jest.runAllTimersAsync();

    // Now await the expectation
    await expectPromise;

    expect(fakeAxiosInstance.get).toHaveBeenCalledTimes(3);
  });
});
