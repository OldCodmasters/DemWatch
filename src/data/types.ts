export type Chamber = 'senate' | 'house' | 'governor';

export type ElectionStatus = 'called' | 'leading' | 'uncalled';

export type WinType = 'flip' | 'hold' | 'open-hold' | 'open-flip' | 'incumbent';

/** Newly elected = 2026 cycle winners; incumbent = already sitting in office. */
export type Cohort = 'newly-elected' | 'incumbent';

export interface SourceLink {
  label: string;
  url: string;
  note?: string;
}

/** Any factual claim shown in the UI must carry sources. */
export interface Claim {
  text: string;
  sources: SourceLink[];
}

export interface PursuingItem {
  text: string;
  sources: SourceLink[];
}

export interface VoteRecord {
  date?: string;
  measure: string;
  position: string;
  body: string;
  note?: string;
  sources: SourceLink[];
}

/** Dated controversy / speech / tweet / news item on an official's personal calendar. */
export type CalendarEventKind = 'tweet' | 'speech' | 'news' | 'bill' | 'trend';

export interface CalendarEvent {
  id: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  title: string;
  description: string;
  kind: CalendarEventKind;
  sources: SourceLink[];
}

export interface Official {
  id: string;
  name: string;
  chamber: Chamber;
  office: string;
  state: string;
  stateFips: string;
  district?: string;
  party: 'Democrat';
  /** Which roster views this person appears in. */
  cohorts: Cohort[];
  winType: WinType;
  status: ElectionStatus;
  photoUrl: string;
  photoAttribution: string;
  bio: Claim;
  ideology: Claim;
  promises: Claim[];
  achievements?: string[];
  pursuing: PursuingItem[];
  voteHistory: VoteRecord[];
  /** Election call / margin / opponent facts */
  electionResult: Claim;
  sources: SourceLink[];
  campaignUrl?: string;
  twitterUrl?: string;
  opponent?: string;
  marginNote?: string;
}

export interface Meta {
  electionDate: string;
  asOf: string;
  summary: string;
  uncalled: { race: string; note: string; sources: SourceLink[] }[];
  sources: SourceLink[];
  statsNote: Claim;
  coverage: {
    newlyElected: string;
    incumbent: string;
    sources: SourceLink[];
  };
}
