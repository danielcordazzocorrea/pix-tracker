import { beforeEach, describe, expect, it } from "vitest";
import { createDemoTransactions, createDemoTransactionsForMonth, isDemoMode, startDemoMode, stopDemoMode } from "./demo";

describe("demo mode", () => {
  beforeEach(() => localStorage.clear());

  it("can be enabled and disabled", () => {
    expect(isDemoMode()).toBe(false);
    startDemoMode();
    expect(isDemoMode()).toBe(true);
    stopDemoMode();
    expect(isDemoMode()).toBe(false);
  });

  it("fills every month in the demo period", () => {
    const transactions = createDemoTransactions(new Date(2026, 8, 15));
    expect(transactions).toHaveLength(360);

    const monthCounts = new Map<string, number>();
    transactions.forEach((item) => {
      const date = new Date(item.transaction_date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
    });

    expect(monthCounts.size).toBe(36);
    expect([...monthCounts.values()].every((count) => count === 10)).toBe(true);
    expect(createDemoTransactionsForMonth(2035, 3)).toHaveLength(10);
  });
});
