/**
 * Deterministic Medicare Advantage appeal deadline logic.
 *
 * Regulatory basis (42 CFR Part 422, Subpart M):
 * - §422.582(b): a standard reconsideration request must be filed within
 *   65 calendar days from the date of the notice of the organization
 *   determination (extended from 60 days effective Jan 1, 2025).
 * - When the notice date is unknown, CMS presumes receipt 5 calendar days
 *   after the determination date unless shown otherwise.
 * - If the deadline lands on a weekend or federal holiday it rolls forward
 *   to the next business day.
 *
 * This module is intentionally LLM-free: dates that drive user action must
 * be computed, never generated.
 */

export const STANDARD_FILING_WINDOW_DAYS = 65;
export const PRESUMED_RECEIPT_DAYS = 5;

export interface DeadlineResult {
  /** Final date (inclusive) on which the Level 1 reconsideration may be filed. */
  deadline: Date;
  /** Whole days remaining from `today` (0 = due today, negative = past due). */
  daysRemaining: number;
  /** True when we had to presume the receipt date from the denial date. */
  estimated: boolean;
  /** True when the window has already closed (good-cause filing still possible). */
  expired: boolean;
}

function utcDate(y: number, m: number, d: number): Date {
  return new Date(Date.UTC(y, m, d));
}

function toUtcMidnight(date: Date): Date {
  return utcDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function nthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const first = utcDate(year, month, 1);
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  return utcDate(year, month, 1 + offset + (n - 1) * 7);
}

function lastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const last = utcDate(year, month + 1, 0);
  const offset = (last.getUTCDay() - weekday + 7) % 7;
  return utcDate(year, month + 1, -offset);
}

/** Shift a fixed-date holiday to its federally observed day (Sat→Fri, Sun→Mon). */
function observed(date: Date): Date {
  if (date.getUTCDay() === 6) return addDays(date, -1);
  if (date.getUTCDay() === 0) return addDays(date, 1);
  return date;
}

/** US federal holidays (observed dates) for a given year, as UTC midnights. */
export function federalHolidays(year: number): Date[] {
  return [
    observed(utcDate(year, 0, 1)), // New Year's Day
    nthWeekdayOfMonth(year, 0, 1, 3), // MLK Day — 3rd Mon of Jan
    nthWeekdayOfMonth(year, 1, 1, 3), // Washington's Birthday — 3rd Mon of Feb
    lastWeekdayOfMonth(year, 4, 1), // Memorial Day — last Mon of May
    observed(utcDate(year, 5, 19)), // Juneteenth
    observed(utcDate(year, 6, 4)), // Independence Day
    nthWeekdayOfMonth(year, 8, 1, 1), // Labor Day — 1st Mon of Sep
    nthWeekdayOfMonth(year, 9, 1, 2), // Columbus Day — 2nd Mon of Oct
    observed(utcDate(year, 10, 11)), // Veterans Day
    nthWeekdayOfMonth(year, 10, 4, 4), // Thanksgiving — 4th Thu of Nov
    observed(utcDate(year, 11, 25)), // Christmas
  ];
}

export function isBusinessDay(date: Date): boolean {
  const day = date.getUTCDay();
  if (day === 0 || day === 6) return false;
  const time = toUtcMidnight(date).getTime();
  return !federalHolidays(date.getUTCFullYear()).some((h) => h.getTime() === time);
}

export function nextBusinessDay(date: Date): Date {
  let candidate = toUtcMidnight(date);
  while (!isBusinessDay(candidate)) candidate = addDays(candidate, 1);
  return candidate;
}

/**
 * Compute the Level 1 reconsideration filing deadline.
 *
 * @param noticeDate date printed on the denial notice, if known
 * @param denialDate date of the organization determination (fallback)
 * @param today      reference date for daysRemaining (defaults to now)
 */
export function appealDeadline(
  noticeDate: Date | null,
  denialDate: Date | null,
  today: Date = new Date(),
): DeadlineResult | null {
  let start: Date;
  let estimated = false;

  if (noticeDate) {
    start = toUtcMidnight(noticeDate);
  } else if (denialDate) {
    start = addDays(toUtcMidnight(denialDate), PRESUMED_RECEIPT_DAYS);
    estimated = true;
  } else {
    return null;
  }

  const deadline = nextBusinessDay(addDays(start, STANDARD_FILING_WINDOW_DAYS));
  const todayMidnight = toUtcMidnight(today);
  const daysRemaining = Math.round(
    (deadline.getTime() - todayMidnight.getTime()) / 86_400_000,
  );

  return { deadline, daysRemaining, estimated, expired: daysRemaining < 0 };
}

export interface ExpeditedInput {
  /** Service has not yet been received (pre-service denial). */
  isPreService: boolean;
  /**
   * The user (not the model) answered yes to: "Could waiting up to 30 days
   * for a standard decision seriously jeopardize the patient's life, health,
   * or ability to regain maximum function?"
   */
  userAttestsSeriousHarm: boolean;
}

/**
 * Expedited (72-hour) reconsideration eligibility per §422.584.
 * Payment-only (post-service) requests cannot be expedited.
 */
export function isExpeditedEligible(input: ExpeditedInput): boolean {
  return input.isPreService && input.userAttestsSeriousHarm;
}
