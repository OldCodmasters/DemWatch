import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, Geometry } from 'geojson';
import { useCohort } from '../context/CohortContext';
import {
  democratDistrictGeoids,
  democratStateFips,
  leadingStateFips,
  officialForDistrict,
  officialsForState,
  STATE_ABBR,
  STATE_NAMES,
} from '../data/officials';

type MapMode = 'states' | 'districts';

type StateProps = { name?: string; id?: string };
type DistrictProps = {
  STATEFP?: string;
  CD?: string;
  GEOID?: string;
  NAME?: string;
};

export function ElectionMap() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { cohort } = useCohort();
  const [mode, setMode] = useState<MapMode>('states');
  const [hover, setHover] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const demStates = useMemo(() => democratStateFips(cohort), [cohort]);
  const leadStates = useMemo(() => leadingStateFips(cohort), [cohort]);
  const demDistricts = useMemo(() => democratDistrictGeoids(cohort), [cohort]);

  useEffect(() => {
    let cancelled = false;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    setReady(false);
    setError(null);

    const width = 960;
    const height = 520;

    async function draw() {
      try {
        const g = svg
          .attr('viewBox', `0 0 ${width} ${height}`)
          .attr('role', 'img')
          .attr('aria-label', mode === 'states' ? 'US states election map' : 'US House districts election map')
          .append('g');

        if (mode === 'states') {
          const topo = (await d3.json('/data/states-10m.json')) as Topology<{
            states: GeometryCollection<StateProps>;
          }>;
          if (cancelled) return;
          const states = feature(topo, topo.objects.states) as FeatureCollection<Geometry, StateProps>;
          const projection = d3.geoAlbersUsa().fitSize([width, height], states);
          const path = d3.geoPath(projection);

          const statePaths = g
            .selectAll('path.state')
            .data(states.features)
            .join('path')
            .attr('class', (d) => {
              const id = String(d.id ?? '').padStart(2, '0');
              const classes = ['state'];
              if (demStates.has(id)) classes.push('dem-win');
              else if (leadStates.has(id)) classes.push('dem-lead');
              else classes.push('other');
              return classes.join(' ');
            })
            .attr('d', (d) => path(d) ?? '')
            .style('opacity', 0)
            .on('mouseenter', (_, d) => {
              const id = String(d.id ?? '').padStart(2, '0');
              setHover(STATE_NAMES[id] ?? d.properties.name ?? id);
            })
            .on('mouseleave', () => setHover(null))
            .on('click', (_, d) => {
              const id = String(d.id ?? '').padStart(2, '0');
              const list = officialsForState(id, cohort).filter((o) => o.chamber !== 'house');
              if (list.length === 1) navigate(`/official/${list[0].id}`);
              else navigate(`/state/${STATE_ABBR[id] ?? id}`);
            });

          statePaths
            .transition()
            .duration(720)
            .ease(d3.easeCubicOut)
            .delay((_, i) => 40 + (i % 12) * 28 + Math.floor(i / 12) * 18)
            .style('opacity', 1);

          // State borders
          g.append('path')
            .datum(states)
            .attr('class', 'mesh')
            .attr('d', path)
            .style('opacity', 0)
            .transition()
            .delay(280)
            .duration(500)
            .style('opacity', 1);
        } else {
          const geo = (await d3.json('/data/districts.geojson')) as FeatureCollection<
            Geometry,
            DistrictProps
          >;
          if (cancelled) return;
          // Filter territories for cleaner continental map
          const features = geo.features.filter((f) => {
            const fp = f.properties.STATEFP ?? '';
            return fp !== '60' && fp !== '66' && fp !== '69' && fp !== '72' && fp !== '78';
          });
          const fc: FeatureCollection<Geometry, DistrictProps> = {
            type: 'FeatureCollection',
            features,
          };
          const projection = d3.geoAlbersUsa().fitSize([width, height], fc);
          const path = d3.geoPath(projection);

          const districtPaths = g
            .selectAll('path.district')
            .data(features)
            .join('path')
            .attr('class', (d) => {
              const geoid = (d.properties.GEOID ?? `${d.properties.STATEFP}${d.properties.CD}`).padStart(
                4,
                '0',
              );
              const classes = ['district'];
              if (demDistricts.has(geoid)) classes.push('dem-win');
              else classes.push('other');
              return classes.join(' ');
            })
            .attr('d', (d) => path(d) ?? '')
            .style('opacity', 0)
            .on('mouseenter', (_, d) => {
              const abbr = STATE_ABBR[d.properties.STATEFP ?? ''] ?? d.properties.STATEFP;
              const cd = d.properties.CD === '00' ? 'AL' : d.properties.CD;
              setHover(`${abbr}-${cd}`);
            })
            .on('mouseleave', () => setHover(null))
            .on('click', (_, d) => {
              const fp = d.properties.STATEFP ?? '';
              const cd = (d.properties.CD ?? '').padStart(2, '0');
              const official = officialForDistrict(fp, cd, cohort);
              if (official) navigate(`/official/${official.id}`);
              else navigate(`/state/${STATE_ABBR[fp] ?? fp}`);
            });

          districtPaths
            .transition()
            .duration(640)
            .ease(d3.easeCubicOut)
            .delay((_, i) => 20 + (i % 24) * 8)
            .style('opacity', 1);
        }

        setReady(true);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load map');
      }
    }

    void draw();
    return () => {
      cancelled = true;
    };
  }, [mode, demStates, demDistricts, leadStates, navigate, cohort]);

  return (
    <div className="map-panel" ref={wrapRef}>
      <div className="map-toolbar">
        <div className="segmented" role="group" aria-label="Map geography">
          <button
            type="button"
            className={mode === 'states' ? 'active' : ''}
            onClick={() => setMode('states')}
          >
            States
          </button>
          <button
            type="button"
            className={mode === 'districts' ? 'active' : ''}
            onClick={() => setMode('districts')}
          >
            Districts
          </button>
        </div>
        <div className="map-hover" aria-live="polite">
          {hover ?? (ready ? '' : 'Loading…')}
        </div>
      </div>
      {error ? <p className="map-error">{error}</p> : null}
      <svg ref={svgRef} className={`election-map ${ready ? 'is-ready' : ''}`} />
      <ul className="map-legend">
        <li>
          <span className="swatch dem-win" /> Democrat win (called / tracked)
        </li>
        <li>
          <span className="swatch dem-lead" /> Leading / uncalled
        </li>
        <li>
          <span className="swatch other" /> Other / no tracked Dem winner
        </li>
      </ul>
      <p className="map-note">
        District geometry: U.S. Census Cartographic Boundary (118th Congress, 20m). Some 2026
        redistricted lines may differ; wins are matched by state + district number.
      </p>
    </div>
  );
}
