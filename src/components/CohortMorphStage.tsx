import type { ReactNode } from 'react';
import { useCohort } from '../context/CohortContext';

/** Wraps map/list content with named view-transition + fancy morph chrome. */
export function CohortMorphStage({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { cohort, morphing, morphDirection } = useCohort();

  return (
    <div
      className={`cohort-stage ${className}${morphing ? ' is-morphing' : ''}`.trim()}
      data-cohort={cohort}
      data-dir={morphDirection ?? undefined}
    >
      <div className="cohort-stage-glow" aria-hidden />
      <div className="cohort-stage-veil" aria-hidden />
      <div className="cohort-stage-content">{children}</div>
    </div>
  );
}
