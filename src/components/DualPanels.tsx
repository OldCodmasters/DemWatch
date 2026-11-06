import { ClaimBlock, Sources } from './Sources';
import type { Official } from '../data/types';

export function DualPanels({ official }: { official: Official }) {
  const pursuing = official.pursuing ?? [];
  const votes = official.voteHistory ?? [];

  return (
    <div className="detail-stack">
      <section className="panel promises panel-wide">
        <header>
          <h2>Promises & ideology</h2>
        </header>
        <ClaimBlock text={official.ideology.text} sources={official.ideology.sources} />
        <ul className="claim-list">
          {official.promises.map((p) => (
            <ClaimBlock key={p.text} text={p.text} sources={p.sources} as="li" />
          ))}
        </ul>
        {(official.campaignUrl || official.twitterUrl) && (
          <div className="sources">
            <h3>Primary channels</h3>
            <ul>
              {official.campaignUrl ? (
                <li>
                  <a href={official.campaignUrl} target="_blank" rel="noreferrer">
                    Campaign / platform site
                  </a>
                </li>
              ) : null}
              {official.twitterUrl ? (
                <li>
                  <a href={official.twitterUrl} target="_blank" rel="noreferrer">
                    X / Twitter
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        )}
      </section>

      <section className="achievements-block">
        <header className="achievements-head">
          <h2>Achievements</h2>
        </header>

        <div className="achievements-grid">
          <section className="panel pursuing">
            <header>
              <h3>Pursuing / going after</h3>
            </header>
            {pursuing.length === 0 ? (
              <p className="empty-panel">None yet.</p>
            ) : (
              <ul className="pursuing-list">
                {pursuing.map((item) => (
                  <li key={item.text}>
                    <p className="claim-text">{item.text}</p>
                    <Sources sources={item.sources} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel votes">
            <header>
              <h3>Vote history</h3>
            </header>
            {votes.length === 0 ? (
              <p className="empty-panel">None yet.</p>
            ) : (
              <ul className="vote-list">
                {votes.map((v) => (
                  <li key={`${v.measure}-${v.position}-${v.date ?? ''}`}>
                    <div className="vote-row">
                      <span
                        className={`vote-pos ${
                          v.position.toLowerCase().includes('no vote') ||
                          v.position.toLowerCase().includes('await')
                            ? 'pending'
                            : ''
                        }`}
                      >
                        {v.position}
                      </span>
                      <div>
                        <strong>{v.measure}</strong>
                        <p className="vote-meta">
                          {v.body}
                          {v.date ? ` · ${v.date}` : ''}
                        </p>
                        {v.note ? <p className="vote-note">{v.note}</p> : null}
                        <Sources sources={v.sources} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}
