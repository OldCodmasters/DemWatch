import type { SourceLink } from '../data/types';

export function Sources({
  sources,
  className = 'inline-sources',
}: {
  sources: SourceLink[];
  className?: string;
}) {
  if (!sources?.length) return null;
  return (
    <ul className={className}>
      {sources.map((s) => (
        <li key={`${s.url}|${s.label}`}>
          <a href={s.url} target="_blank" rel="noreferrer">
            {s.label}
          </a>
          {s.note ? <span className="source-note"> — {s.note}</span> : null}
        </li>
      ))}
    </ul>
  );
}

export function ClaimBlock({
  text,
  sources,
  as = 'p',
}: {
  text: string;
  sources: SourceLink[];
  as?: 'p' | 'li' | 'span';
}) {
  const Tag = as;
  return (
    <Tag className="claim">
      <span className="claim-text">{text}</span>
      <Sources sources={sources} />
    </Tag>
  );
}
