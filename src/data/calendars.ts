import raw from './calendars.json';
import type { CalendarEvent } from './types';

const byId = (raw as { calendars: Record<string, CalendarEvent[]> }).calendars;

/** Controversies / speeches / tweets for an official. Empty array if none verified yet. */
export function getCalendar(officialId: string): CalendarEvent[] {
  return byId[officialId] ?? [];
}

export function calendarMonthKey(isoDate: string): string {
  return isoDate.slice(0, 7); // YYYY-MM
}

export function eventsOnDay(events: CalendarEvent[], isoDate: string): CalendarEvent[] {
  return events.filter((e) => e.date === isoDate);
}

export function eventsInMonth(events: CalendarEvent[], year: number, monthIndex: number): CalendarEvent[] {
  const prefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  return events.filter((e) => e.date.startsWith(prefix));
}
