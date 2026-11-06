import { Link, useParams } from 'react-router-dom';
import { ControversyCalendar } from '../components/ControversyCalendar';
import { DualPanels } from '../components/DualPanels';
import { Sources } from '../components/Sources';
import { getCalendar } from '../data/calendars';
import { getOfficial } from '../data/officials';

export function OfficialPage() {
  const { id } = useParams();
  const official = id ? getOfficial(id) : undefined;
  const calendar = id ? getCalendar(id) : [];

  if (!official) {
    return (
      <div className="page-header">
        <h1>Official not found</h1>
        <p>
          <Link to="/">Back to map</Link>
        </p>
      </div>
    );
  }

  const place = official.district
    ? `${official.state}-${official.district}`
    : official.state;

  return (
    <article className="official-page">
      <header className="official-hero">
        <img
          src={official.photoUrl}
          alt={`Portrait of ${official.name}`}
          width={140}
          height={140}
        />
        <div>
          <p className="eyebrow">
            {official.office} · {place}
            {official.status === 'leading' ? ' · Leading (uncalled)' : ''}
          </p>
          <h1>{official.name}</h1>
          <p className="lede claim-text">{official.bio.text}</p>
          <Sources sources={official.bio.sources} />
          <div className="chips">
            <span className="chip">{official.winType.replace('-', ' ')}</span>
            {official.electionResult ? (
              <span className="chip muted">{official.electionResult.text}</span>
            ) : official.marginNote ? (
              <span className="chip muted">{official.marginNote}</span>
            ) : null}
            {official.opponent ? <span className="chip muted">vs {official.opponent}</span> : null}
          </div>
          {official.electionResult ? (
            <Sources sources={official.electionResult.sources} />
          ) : null}
          <p className="photo-attr">{official.photoAttribution}</p>
        </div>
      </header>
      <DualPanels official={official} />
      <ControversyCalendar officialName={official.name} events={calendar} />
      <p className="back-link">
        <Link to={`/${official.chamber === 'governor' ? 'governors' : official.chamber}`}>
          ← All {official.chamber === 'governor' ? 'governors' : official.chamber}
        </Link>
      </p>
    </article>
  );
}
