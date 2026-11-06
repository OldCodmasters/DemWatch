import { useMemo, useState } from 'react';
import type { CalendarEvent, CalendarEventKind } from '../data/types';
import { eventsInMonth, eventsOnDay } from '../data/calendars';
import { Sources } from './Sources';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const KIND_LABEL: Record<CalendarEventKind, string> = {
  tweet: 'Tweet / X',
  speech: 'Speech',
  news: 'News',
  bill: 'Bill / vote',
  trend: 'Trend',
};

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function toISODate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatLong(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ControversyCalendar({
  officialName,
  events,
}: {
  officialName: string;
  events: CalendarEvent[];
}) {
  const sorted = useMemo(
    () => [...events].sort((a, b) => b.date.localeCompare(a.date)),
    [events],
  );

  const initial = useMemo(() => {
    if (sorted[0]) {
      const [y, m] = sorted[0].date.split('-').map(Number);
      return { year: y, month: m - 1 };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, [sorted]);

  const [year, setYear] = useState(initial.year);
  const [month, setMonth] = useState(initial.month);
  const [selected, setSelected] = useState<string | null>(sorted[0]?.date ?? null);

  const monthEvents = eventsInMonth(sorted, year, month);
  const selectedEvents = selected ? eventsOnDay(sorted, selected) : [];

  const firstDow = startOfMonth(year, month).getDay();
  const totalDays = daysInMonth(year, month);
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function shift(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSelected(null);
  }

  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <section className="controversy-calendar" aria-label={`Controversy calendar for ${officialName}`}>
      <header className="cal-head">
        <h2>Controversy calendar</h2>
        <div className="cal-nav" role="group" aria-label="Month">
          <button type="button" onClick={() => shift(-1)} aria-label="Previous month">
            ‹
          </button>
          <span className="cal-month-label">{monthLabel}</span>
          <button type="button" onClick={() => shift(1)} aria-label="Next month">
            ›
          </button>
        </div>
      </header>

      {sorted.length === 0 ? (
        <p className="empty-panel cal-empty">None yet.</p>
      ) : (
        <div className="cal-layout">
          <div className="cal-grid-wrap">
            <div className="cal-weekdays" aria-hidden>
              {WEEKDAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="cal-grid" role="grid" aria-label={monthLabel}>
              {cells.map((day, idx) => {
                if (day == null) {
                  return <div key={`e-${idx}`} className="cal-cell empty" />;
                }
                const iso = toISODate(year, month, day);
                const dayEvents = eventsOnDay(sorted, iso);
                const has = dayEvents.length > 0;
                const isSel = selected === iso;
                return (
                  <button
                    key={iso}
                    type="button"
                    role="gridcell"
                    className={`cal-cell${has ? ' has-event' : ''}${isSel ? ' selected' : ''}`}
                    aria-label={
                      has
                        ? `${formatLong(iso)}, ${dayEvents.length} item${dayEvents.length > 1 ? 's' : ''}`
                        : formatLong(iso)
                    }
                    aria-pressed={isSel}
                    onClick={() => setSelected(has ? iso : iso)}
                    disabled={!has}
                  >
                    <span className="cal-daynum">{day}</span>
                    {has ? (
                      <span className="cal-dots" aria-hidden>
                        {dayEvents.slice(0, 3).map((e) => (
                          <i key={e.id} className={`dot kind-${e.kind}`} />
                        ))}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <ul className="cal-legend">
              {(Object.keys(KIND_LABEL) as CalendarEventKind[]).map((k) => (
                <li key={k}>
                  <i className={`dot kind-${k}`} /> {KIND_LABEL[k]}
                </li>
              ))}
            </ul>
            <p className="cal-month-count">
              {monthEvents.length} sourced item{monthEvents.length === 1 ? '' : 's'} this month ·{' '}
              {sorted.length} total on file
            </p>
          </div>

          <aside className="cal-detail" aria-live="polite">
            {selected && selectedEvents.length > 0 ? (
              <>
                <h3>{formatLong(selected)}</h3>
                <ul className="cal-event-list">
                  {selectedEvents.map((e) => (
                    <li key={e.id} className={`cal-event kind-${e.kind}`}>
                      <span className="cal-kind">{KIND_LABEL[e.kind]}</span>
                      <strong>{e.title}</strong>
                      <p>{e.description}</p>
                      <Sources sources={e.sources} />
                    </li>
                  ))}
                </ul>
              </>
            ) : selected ? (
              <>
                <h3>{formatLong(selected)}</h3>
                <p className="empty-panel">None.</p>
              </>
            ) : (
              <>
                <h3>Recent items</h3>
                <ul className="cal-event-list">
                  {sorted.slice(0, 5).map((e) => (
                    <li key={e.id} className={`cal-event kind-${e.kind}`}>
                      <button
                        type="button"
                        className="cal-jump"
                        onClick={() => {
                          const [y, m] = e.date.split('-').map(Number);
                          setYear(y);
                          setMonth(m - 1);
                          setSelected(e.date);
                        }}
                      >
                        <time dateTime={e.date}>{formatLong(e.date)}</time>
                        <span className="cal-kind">{KIND_LABEL[e.kind]}</span>
                        <strong>{e.title}</strong>
                      </button>
                      <p>{e.description}</p>
                      <Sources sources={e.sources} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        </div>
      )}

      {sorted.length > 0 ? (
        <details className="cal-timeline">
          <summary>Full timeline ({sorted.length})</summary>
          <ol>
            {sorted.map((e) => (
              <li key={e.id}>
                <time dateTime={e.date}>{formatLong(e.date)}</time>
                <span className="cal-kind">{KIND_LABEL[e.kind]}</span>
                <strong>{e.title}</strong>
                <p>{e.description}</p>
                <Sources sources={e.sources} />
              </li>
            ))}
          </ol>
        </details>
      ) : null}
    </section>
  );
}
