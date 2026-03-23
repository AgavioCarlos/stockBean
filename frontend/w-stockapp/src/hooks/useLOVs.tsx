import { useState, useEffect, useCallback } from 'react';
import * as Lovs from '../services/Lovs';

type FetcherMap = Record<string, (signal?: AbortSignal) => Promise<any>>;

const fetchers: FetcherMap = {
  roles: Lovs.Roles,
  unidades: Lovs.Unidades,
  productos: Lovs.Productos,
  sucursales: Lovs.Sucursales,
  categorias: Lovs.Categorias,
  categoriasAsignadas: Lovs.CategoriasAsignadas,
  marcas: Lovs.Marcas,
  tipo_precios: Lovs.TipoPrecios,
};

/**
 * Caché global para los LOVs (Lists of Values).
 * Al ser una constante fuera de la función, persiste entre renders y componentes.
 */
const CACHE: Map<string, { data: any; ts: number }> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos por defecto

/**
 * Invalida la caché de ciertos LOVs para forzar una recarga en la próxima llamada.
 * Si no se pasan keys, invalida toda la caché.
 */
export const invalidateLOVCache = (keys?: string[]) => {
  if (!keys) {
    CACHE.clear();
  } else {
    keys.forEach(k => CACHE.delete(k));
  }
};

/**
 * Hook para cargar catálogos (LOVs) con sistema de caché global y abort controller.
 * @param keys Arreglo de catálogos a cargar (ej. ['roles', 'unidades']).
 * @param force Si true, ignora la caché y fuerza el fetch.
 */
export const useLOVs = (keys: string[] = [], force: boolean = false) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  
  const keysKey = (keys || []).join(',');

  const load = useCallback(async (signal?: AbortSignal) => {
    const keysToFetch = keys && keys.length > 0 ? keys : Object.keys(fetchers);
    const now = Date.now();
    const finalData: Record<string, any> = {};
    const pendingKeys: string[] = [];

    // 1. Verificar caché
    keysToFetch.forEach((k) => {
      const cached = CACHE.get(k);
      if (!force && cached && (now - cached.ts < CACHE_TTL)) {
        finalData[k] = cached.data;
      } else {
        pendingKeys.push(k);
      }
    });

    // 2. Si todo está en caché, retornar
    if (pendingKeys.length === 0) {
      setData(finalData);
      setLoading(false);
      return;
    }

    // 3. Cargar lo pendiente
    setLoading(true);
    try {
      const promises = pendingKeys.map((k) => {
        const fn = fetchers[k];
        if (!fn) return Promise.resolve(null);
        return fn(signal);
      });

      const results = await Promise.all(promises);

      // 4. Guardar resultados en caché y en el estado
      pendingKeys.forEach((k, i) => {
        const result = results[i];
        CACHE.set(k, { data: result, ts: now });
        finalData[k] = result;
      });

      setData({ ...finalData });
    } catch (err) {
      if ((err as any)?.name === 'AbortError') return;
      console.error('Error cargando LOVs', err);
    } finally {
      setLoading(false);
    }
  }, [keysKey, force]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);

    return () => {
      controller.abort();
    };
  }, [load]);

  return { data, loading, reload: () => load() };
};