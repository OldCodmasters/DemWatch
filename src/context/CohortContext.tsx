import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { flushSync } from 'react-dom';
import type { Cohort } from '../data/types';

type CohortContextValue = {
  cohort: Cohort;
  setCohort: (c: Cohort) => void;
  morphing: boolean;
  morphDirection: 'to-incumbent' | 'to-newly' | null;
};

const CohortContext = createContext<CohortContextValue>({
  cohort: 'newly-elected',
  setCohort: () => undefined,
  morphing: false,
  morphDirection: null,
});

export function CohortProvider({ children }: { children: ReactNode }) {
  const [cohort, setCohortState] = useState<Cohort>(() => {
    const saved = localStorage.getItem('demwatch-cohort');
    return saved === 'incumbent' || saved === 'newly-elected' ? saved : 'newly-elected';
  });
  const [morphing, setMorphing] = useState(false);
  const [morphDirection, setMorphDirection] = useState<
    'to-incumbent' | 'to-newly' | null
  >(null);
  const busy = useRef(false);

  useEffect(() => {
    localStorage.setItem('demwatch-cohort', cohort);
    document.documentElement.setAttribute('data-cohort', cohort);
  }, [cohort]);

  const setCohort = useCallback(
    (next: Cohort) => {
      if (next === cohort || busy.current) return;
      busy.current = true;
      const direction = next === 'incumbent' ? 'to-incumbent' : 'to-newly';
      setMorphDirection(direction);
      setMorphing(true);
      document.documentElement.classList.add('cohort-morphing');
      document.documentElement.setAttribute('data-morph-dir', direction);

      const apply = () => {
        flushSync(() => setCohortState(next));
      };

      const finish = () => {
        window.setTimeout(() => {
          setMorphing(false);
          setMorphDirection(null);
          document.documentElement.classList.remove('cohort-morphing');
          document.documentElement.removeAttribute('data-morph-dir');
          busy.current = false;
        }, 120);
      };

      const startVT = (
        document as Document & {
          startViewTransition?: (update: () => void) => { finished: Promise<void> };
        }
      ).startViewTransition;

      if (typeof startVT === 'function') {
        const vt = startVT(apply);
        void vt.finished.then(finish).catch(finish);
      } else {
        apply();
        window.setTimeout(finish, 900);
      }
    },
    [cohort],
  );

  const value = useMemo(
    () => ({
      cohort,
      setCohort,
      morphing,
      morphDirection,
    }),
    [cohort, setCohort, morphing, morphDirection],
  );

  return <CohortContext.Provider value={value}>{children}</CohortContext.Provider>;
}

export function useCohort() {
  return useContext(CohortContext);
}
