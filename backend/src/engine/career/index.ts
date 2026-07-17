import type { CareerState, EndReason, TimelineEntry } from '../types.js';

export function createCareer(startYear: number): CareerState {
  return {
    startYear,
    currentYear: startYear,
    currentMonth: 1,
    monthsPlayed: 0,
    timeline: [
      {
        year: startYear,
        month: 1,
        title: 'Início da carreira',
        description: 'Você entra no mercado de tecnologia.',
        type: 'milestone',
      },
    ],
    peakSalary: 0,
    endReason: null,
  };
}

export function advanceMonth(career: CareerState): CareerState {
  let { currentYear, currentMonth, monthsPlayed } = career;
  currentMonth += 1;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear += 1;
  }

  return {
    ...career,
    currentYear,
    currentMonth,
    monthsPlayed: monthsPlayed + 1,
  };
}

export function addTimelineEntry(
  career: CareerState,
  entry: Omit<TimelineEntry, 'year' | 'month'> &
    Partial<Pick<TimelineEntry, 'year' | 'month'>>,
): CareerState {
  return {
    ...career,
    timeline: [
      ...career.timeline,
      {
        year: entry.year ?? career.currentYear,
        month: entry.month ?? career.currentMonth,
        title: entry.title,
        description: entry.description,
        type: entry.type,
      },
    ],
  };
}

export function markCareerEnd(
  career: CareerState,
  reason: EndReason,
): CareerState {
  return {
    ...career,
    endReason: reason,
  };
}

export function updatePeakSalary(
  career: CareerState,
  salary: number,
): CareerState {
  return {
    ...career,
    peakSalary: Math.max(career.peakSalary, salary),
  };
}
