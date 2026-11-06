import { useCohort } from '../context/CohortContext';
import type { Cohort } from '../data/types';

const OPTIONS: { id: Cohort; label: string; hint: string }[] = [
  {
    id: 'newly-elected',
    label: 'Newly elected',
    hint: '2026 cycle winners',
  },
  {
    id: 'incumbent',
    label: 'Already in office',
    hint: 'Sitting Democrats',
  },
];

export function CohortToggle() {
  const { cohort, setCohort, morphing, morphDirection } = useCohort();

  return (
    <div
      className={`cohort-toggle${morphing ? ' is-morphing' : ''}`}
      data-dir={morphDirection ?? undefined}
      role="group"
      aria-label="Roster view"
    >
      <div className="cohort-toggle-track" data-active={cohort}>
        <span className="cohort-toggle-thumb" aria-hidden>
          <span className="cohort-toggle-sheen" />
        </span>
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={cohort === opt.id ? 'active' : ''}
            aria-pressed={cohort === opt.id}
            disabled={morphing}
            onClick={() => setCohort(opt.id)}
          >
            <span className="cohort-label">{opt.label}</span>
            <span className="cohort-hint">{opt.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
