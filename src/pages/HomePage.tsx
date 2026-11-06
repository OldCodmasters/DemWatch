import { CohortMorphStage } from '../components/CohortMorphStage';
import { CohortToggle } from '../components/CohortToggle';
import { ElectionMap } from '../components/ElectionMap';
import { Sources } from '../components/Sources';
import { useCohort } from '../context/CohortContext';
import { cohortStats, meta } from '../data/officials';

export function HomePage() {
  const { cohort } = useCohort();
  const stats = cohortStats(cohort);
  const isNew = cohort === 'newly-elected';

  return (
    <div className="home">
      <section id="explorer" className="explorer explorer-first">
        <div className="explorer-head map-head">
          <div className="map-head-copy">
            <p className="eyebrow">
              {isNew
                ? `2026 midterms · as of ${meta.asOf}`
                : 'Sitting Democrats · Senate, House & governors'}
            </p>
            <h1>{isNew ? 'Election map' : 'Incumbent map'}</h1>
          </div>
          <CohortToggle />
        </div>

        <CohortMorphStage>
          <ElectionMap />
        </CohortMorphStage>

        <div className="stat-row cohort-stats" aria-label="Coverage snapshot">
          <div>
            <strong>{stats.called}</strong>
            <span>{isNew ? 'called winners tracked' : 'sitting officials tracked'}</span>
          </div>
          <div>
            <strong>{isNew ? stats.flips : stats.senate}</strong>
            <span>{isNew ? 'flips / open flips' : 'Senate Democrats'}</span>
          </div>
          <div>
            <strong>{isNew ? stats.leading : stats.governor}</strong>
            <span>{isNew ? 'still leading / uncalled' : 'Democratic governors'}</span>
          </div>
        </div>
        {isNew && meta.statsNote ? (
          <div className="stats-sources">
            <Sources sources={meta.statsNote.sources} />
          </div>
        ) : null}
        {!isNew && meta.coverage ? (
          <div className="stats-sources coverage-note">
            <Sources sources={meta.coverage.sources} />
          </div>
        ) : null}
      </section>

      {isNew ? (
        <section className="uncalled">
          <h2>Still uncalled</h2>
          <ul>
            {meta.uncalled.map((u) => (
              <li key={u.race}>
                <strong>{u.race}</strong>
                <span>{u.note}</span>
                <Sources sources={u.sources?.length ? u.sources : meta.sources.slice(0, 2)} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="uncalled">
          <h2>What’s included</h2>
          <ul>
            <li>
              <strong>Senate</strong>
              <span>{stats.senate}</span>
            </li>
            <li>
              <strong>Governors</strong>
              <span>{stats.governor}</span>
            </li>
            <li>
              <strong>House</strong>
              <span>{stats.house}</span>
            </li>
          </ul>
          {meta.coverage ? <Sources sources={meta.coverage.sources} /> : null}
        </section>
      )}
    </div>
  );
}
