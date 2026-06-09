import { describe, expect, it } from "vitest";
import {
  appealDeadline,
  federalHolidays,
  isBusinessDay,
  isExpeditedEligible,
  nextBusinessDay,
} from "../src/lib/deadlines";

const utc = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d));

describe("appealDeadline", () => {
  it("adds 65 calendar days to a known notice date", () => {
    // Jan 2 2026 + 65 days = Mar 8 2026 (Sunday) → rolls to Mon Mar 9
    const result = appealDeadline(utc(2026, 0, 2), null, utc(2026, 0, 10));
    expect(result).not.toBeNull();
    expect(result!.deadline.toISOString().slice(0, 10)).toBe("2026-03-09");
    expect(result!.estimated).toBe(false);
    expect(result!.expired).toBe(false);
  });

  it("falls back to denial date + 5 presumed receipt days and flags estimate", () => {
    const withNotice = appealDeadline(utc(2026, 2, 6), null, utc(2026, 2, 10))!;
    const presumed = appealDeadline(null, utc(2026, 2, 1), utc(2026, 2, 10))!;
    expect(presumed.estimated).toBe(true);
    expect(presumed.deadline.getTime()).toBe(withNotice.deadline.getTime());
  });

  it("returns null when no dates are known", () => {
    expect(appealDeadline(null, null)).toBeNull();
  });

  it("rolls a weekend deadline forward to the next business day", () => {
    // Pick a notice date whose +65 lands on a Saturday: Apr 4 2026 (Sat)
    // 65 days before Apr 4 2026 = Jan 29 2026.
    const result = appealDeadline(utc(2026, 0, 29), null, utc(2026, 1, 1))!;
    expect(result.deadline.getUTCDay()).not.toBe(0);
    expect(result.deadline.getUTCDay()).not.toBe(6);
    expect(result.deadline.toISOString().slice(0, 10)).toBe("2026-04-06");
  });

  it("rolls a holiday deadline past the holiday", () => {
    // Notice date such that +65 lands on Jul 4 2026 (Sat, observed Fri Jul 3).
    // Apr 30 2026 + 65 = Jul 4 2026 → Sat → Mon Jul 6 (Jul 3 is observed holiday...
    // roll forward from Sat: Sun 5, Mon 6 — Mon Jul 6 is a business day).
    const result = appealDeadline(utc(2026, 3, 30), null, utc(2026, 4, 1))!;
    expect(result.deadline.toISOString().slice(0, 10)).toBe("2026-07-06");
  });

  it("computes daysRemaining and expiry", () => {
    const result = appealDeadline(utc(2026, 0, 2), null, utc(2026, 2, 9))!;
    expect(result.daysRemaining).toBe(0);
    expect(result.expired).toBe(false);

    const expired = appealDeadline(utc(2026, 0, 2), null, utc(2026, 2, 10))!;
    expect(expired.daysRemaining).toBe(-1);
    expect(expired.expired).toBe(true);
  });
});

describe("federal holidays / business days", () => {
  it("includes observed New Year's Day when Jan 1 falls on a weekend", () => {
    // Jan 1 2028 is a Saturday → observed Fri Dec 31 2027 (in 2028's list per fixed-date shift)
    const holidays2026 = federalHolidays(2026).map((d) => d.toISOString().slice(0, 10));
    expect(holidays2026).toContain("2026-01-01");
    expect(holidays2026).toContain("2026-11-26"); // Thanksgiving 2026
    expect(holidays2026).toContain("2026-12-25");
  });

  it("treats Thanksgiving as a non-business day", () => {
    expect(isBusinessDay(utc(2026, 10, 26))).toBe(false);
    expect(nextBusinessDay(utc(2026, 10, 26)).toISOString().slice(0, 10)).toBe(
      "2026-11-27",
    );
  });
});

describe("isExpeditedEligible", () => {
  it("requires both pre-service status and user harm attestation", () => {
    expect(isExpeditedEligible({ isPreService: true, userAttestsSeriousHarm: true })).toBe(true);
    expect(isExpeditedEligible({ isPreService: false, userAttestsSeriousHarm: true })).toBe(false);
    expect(isExpeditedEligible({ isPreService: true, userAttestsSeriousHarm: false })).toBe(false);
  });
});
