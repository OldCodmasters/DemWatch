import raw from './officials.json';
import incumbentsRaw from './incumbents.json';
import type { Cohort, Meta, Official } from './types';

export const meta = raw.meta as Meta;

function personKey(o: Pick<Official, 'chamber' | 'state' | 'name' | 'district'>): string {
  if (o.chamber === 'house') {
    return `house|${o.state}|${(o.district ?? '').padStart(2, '0')}|${o.name.toLowerCase()}`;
  }
  return `${o.chamber}|${o.state}|${o.name.toLowerCase()}`;
}

function mergeRosters(newly: Official[], sitting: Official[]): Official[] {
  const map = new Map<string, Official>();

  for (const o of newly) {
    const cohorts = new Set<Cohort>(o.cohorts?.length ? o.cohorts : ['newly-elected']);
    map.set(personKey(o), { ...o, cohorts: [...cohorts] });
  }

  for (const o of sitting) {
    const key = personKey(o);
    const existing = map.get(key);
    if (existing) {
      const cohorts = new Set<Cohort>([...existing.cohorts, 'incumbent']);
      map.set(key, { ...existing, cohorts: [...cohorts] });
    } else {
      map.set(key, {
        ...o,
        cohorts: o.cohorts?.length ? o.cohorts : ['incumbent'],
      });
    }
  }

  return [...map.values()].sort(
    (a, b) =>
      a.chamber.localeCompare(b.chamber) ||
      a.state.localeCompare(b.state) ||
      a.name.localeCompare(b.name),
  );
}

export const allOfficials: Official[] = mergeRosters(
  raw.officials as Official[],
  (incumbentsRaw as { officials: Official[] }).officials,
);

/** @deprecated Prefer allOfficials + filterByCohort; kept as full roster alias. */
export const officials = allOfficials;

export function filterByCohort(list: Official[], cohort: Cohort): Official[] {
  return list.filter((o) => o.cohorts.includes(cohort));
}

export function getOfficial(id: string): Official | undefined {
  return allOfficials.find((o) => o.id === id);
}

export function byChamber(chamber: Official['chamber'], cohort?: Cohort): Official[] {
  return allOfficials
    .filter((o) => o.chamber === chamber && (!cohort || o.cohorts.includes(cohort)))
    .sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name));
}

export function officialsForState(stateFips: string, cohort?: Cohort): Official[] {
  return allOfficials.filter(
    (o) => o.stateFips === stateFips && (!cohort || o.cohorts.includes(cohort)),
  );
}

export function officialForDistrict(
  stateFips: string,
  district: string,
  cohort?: Cohort,
): Official | undefined {
  const cd = district.padStart(2, '0');
  return allOfficials.find(
    (o) =>
      o.chamber === 'house' &&
      o.stateFips === stateFips &&
      (o.district ?? '').padStart(2, '0') === cd &&
      (!cohort || o.cohorts.includes(cohort)),
  );
}

export function democratStateFips(cohort?: Cohort): Set<string> {
  const set = new Set<string>();
  for (const o of allOfficials) {
    if (cohort && !o.cohorts.includes(cohort)) continue;
    if (o.status === 'called' && (o.chamber === 'senate' || o.chamber === 'governor')) {
      set.add(o.stateFips);
    }
  }
  return set;
}

export function democratDistrictGeoids(cohort?: Cohort): Set<string> {
  const set = new Set<string>();
  for (const o of allOfficials) {
    if (cohort && !o.cohorts.includes(cohort)) continue;
    if (o.chamber === 'house' && o.district && (o.status === 'called' || o.status === 'leading')) {
      set.add(`${o.stateFips}${o.district.padStart(2, '0')}`);
    }
  }
  return set;
}

export function leadingStateFips(cohort?: Cohort): Set<string> {
  return new Set(
    allOfficials
      .filter(
        (o) =>
          o.status === 'leading' &&
          o.chamber !== 'house' &&
          (!cohort || o.cohorts.includes(cohort)),
      )
      .map((o) => o.stateFips),
  );
}

export function cohortStats(cohort: Cohort) {
  const list = filterByCohort(allOfficials, cohort);
  return {
    total: list.length,
    called: list.filter((o) => o.status === 'called').length,
    leading: list.filter((o) => o.status === 'leading').length,
    flips: list.filter((o) => o.status === 'called' && o.winType.includes('flip')).length,
    senate: list.filter((o) => o.chamber === 'senate').length,
    house: list.filter((o) => o.chamber === 'house').length,
    governor: list.filter((o) => o.chamber === 'governor').length,
  };
}

export const STATE_NAMES: Record<string, string> = {
  '01': 'Alabama', '02': 'Alaska', '04': 'Arizona', '05': 'Arkansas', '06': 'California',
  '08': 'Colorado', '09': 'Connecticut', '10': 'Delaware', '11': 'District of Columbia',
  '12': 'Florida', '13': 'Georgia', '15': 'Hawaii', '16': 'Idaho', '17': 'Illinois',
  '18': 'Indiana', '19': 'Iowa', '20': 'Kansas', '21': 'Kentucky', '22': 'Louisiana',
  '23': 'Maine', '24': 'Maryland', '25': 'Massachusetts', '26': 'Michigan', '27': 'Minnesota',
  '28': 'Mississippi', '29': 'Missouri', '30': 'Montana', '31': 'Nebraska', '32': 'Nevada',
  '33': 'New Hampshire', '34': 'New Jersey', '35': 'New Mexico', '36': 'New York',
  '37': 'North Carolina', '38': 'North Dakota', '39': 'Ohio', '40': 'Oklahoma', '41': 'Oregon',
  '42': 'Pennsylvania', '44': 'Rhode Island', '45': 'South Carolina', '46': 'South Dakota',
  '47': 'Tennessee', '48': 'Texas', '49': 'Utah', '50': 'Vermont', '51': 'Virginia',
  '53': 'Washington', '54': 'West Virginia', '55': 'Wisconsin', '56': 'Wyoming',
};

export const STATE_ABBR: Record<string, string> = Object.fromEntries(
  Object.entries({
    AL: '01', AK: '02', AZ: '04', AR: '05', CA: '06', CO: '08', CT: '09', DE: '10', FL: '12',
    GA: '13', HI: '15', ID: '16', IL: '17', IN: '18', IA: '19', KS: '20', KY: '21', LA: '22',
    ME: '23', MD: '24', MA: '25', MI: '26', MN: '27', MS: '28', MO: '29', MT: '30', NE: '31',
    NV: '32', NH: '33', NJ: '34', NM: '35', NY: '36', NC: '37', ND: '38', OH: '39', OK: '40',
    OR: '41', PA: '42', RI: '44', SC: '45', SD: '46', TN: '47', TX: '48', UT: '49', VT: '50',
    VA: '51', WA: '53', WV: '54', WI: '55', WY: '56',
  }).map(([abbr, fips]) => [fips, abbr]),
);
