import { Link } from 'react-router-dom';
import type { Official } from '../data/types';

export function OfficialCard({ official }: { official: Official }) {
  const badge =
    official.status === 'leading'
      ? 'Leading'
      : official.winType === 'incumbent'
        ? 'In office'
        : official.winType.includes('flip')
          ? 'Flip'
          : 'Hold';

  const resultSources =
    official.electionResult?.sources ??
    official.sources.filter((s) => /nbc|ballotpedia|polling|cbs|multistate/i.test(s.label)).slice(0, 2);

  return (
    <Link to={`/official/${official.id}`} className="official-card">
      <img
        src={official.photoUrl}
        alt={`Portrait of ${official.name}`}
        width={72}
        height={72}
        loading="lazy"
      />
      <div>
        <div className="card-top">
          <h3>{official.name}</h3>
          <span className={`badge ${official.status === 'leading' ? 'warn' : ''}`}>{badge}</span>
        </div>
        <p className="meta">
          {official.office}
          {official.district ? ` · ${official.state}-${official.district}` : ` · ${official.state}`}
        </p>
        <p className="blurb">{official.ideology.text}</p>
        {official.electionResult ? (
          <p className="card-result">{official.electionResult.text}</p>
        ) : null}
        {resultSources.length > 0 ? (
          <p className="card-sources-text">
            Sources: {resultSources.map((s) => s.label).join(' · ')}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
