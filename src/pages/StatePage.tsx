import { Link, useParams } from 'react-router-dom';
import { OfficialCard } from '../components/OfficialCard';
import { CohortMorphStage } from '../components/CohortMorphStage';
import { CohortToggle } from '../components/CohortToggle';
import { useCohort } from '../context/CohortContext';
import { filterByCohort, officials, STATE_ABBR, STATE_NAMES } from '../data/officials';

export function StatePage() {
  const { code } = useParams();
  const { cohort } = useCohort();
  const abbr = (code ?? '').toUpperCase();
  const fips = Object.entries(STATE_ABBR).find(([, a]) => a === abbr)?.[0];
  const list = filterByCohort(
    officials.filter((o) => o.state === abbr || o.stateFips === fips),
    cohort,
  );

  return (
    <div className="chamber-page">
      <header className="page-header">
        <h1>{fips ? STATE_NAMES[fips] : abbr}</h1>
        <div className="page-header-actions">
          <CohortToggle />
          <Link className="btn ghost" to="/">
            Map
          </Link>
        </div>
      </header>
      {list.length === 0 ? (
        <p className="empty">None yet.</p>
      ) : (
        <CohortMorphStage>
          <div className="official-grid">
            {list.map((o) => (
              <OfficialCard key={o.id} official={o} />
            ))}
          </div>
        </CohortMorphStage>
      )}
    </div>
  );
}
