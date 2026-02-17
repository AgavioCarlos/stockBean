import { useState, useEffect } from 'react';
import * as Lovs from '../services/Lovs';

type FetcherMap = Record<string, (signal?: AbortSignal) => Promise<any>>;

const fetchers: FetcherMap = {
  roles: Lovs.Roles,
  unidades: Lovs.Unidades,
};

export const useLOVs = (keys: string[] = []) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  // Create a stable key from the keys array so callers passing a new array literal
  // on each render don't trigger repeat fetches. Example: useLOVs(['roles'])
  const keysKey = (keys || []).join(',');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {

    const controller = new AbortController();
    const signal = controller.signal;

  const keysToFetch = keys && keys.length > 0 ? keys : Object.keys(fetchers);

    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const promises = keysToFetch.map((k) => {
          const fn = fetchers[k];
          if (!fn) return Promise.resolve(null);
          return fn(signal);
        });

        const results = await Promise.all(promises);

        if (!mounted) return;

        const newData = keysToFetch.reduce<Record<string, any>>((acc, k, i) => {
          acc[k] = results[i];
          return acc;
        }, {});

        setData(newData);
      } catch (err) {
        if ((err as any)?.name === 'AbortError') return;
        console.error('Error cargando LOVs', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
      controller.abort();
    };
    // Depend on a stable string created from keys to avoid re-running when callers pass
    // a new array instance with identical contents.
  }, [keysKey]);

  return { data, loading };
};