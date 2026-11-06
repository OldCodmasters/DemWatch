import { OfficialCard } from '../components/OfficialCard';
import { CohortMorphStage } from '../components/CohortMorphStage';
import { CohortToggle } from '../components/CohortToggle';
import { Sources } from '../components/Sources';
import { useCohort } from '../context/CohortContext';
import { byChamber, meta } from '../data/officials';
import type { Chamber } from '../data/types';

const titles: Record<Chamber, string> = {
  senate: 'Senate',
  house: 'House',
  governor: 'Governors',
};

export function ChamberPage({ chamber }: { chamber: Chamber }) {
  const { cohort } = useCohort();
  const list = byChamber(chamber, cohort);
  const title = titles[chamber];

  return (
    <div className="chamber-page">
      <header className="page-header">
        <h1>{title}</h1>
        <CohortToggle />
      </header>
      <CohortMorphStage className="official-grid-wrap">
        <div className="official-grid">
          {list.map((o) => (
            <OfficialCard key={o.id} official={o} />
          ))}
        </div>
      </CohortMorphStage>
      {cohort === 'incumbent' && meta.coverage ? (
        <div className="stats-sources coverage-note">
          <Sources sources={meta.coverage.sources} />
        </div>
      ) : null}
    </div>
  );
}
