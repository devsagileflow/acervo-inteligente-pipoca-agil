"use client";

import { startTransition, useEffect, useState } from "react";
import type { Result } from "@acervo/schemas";

export type UseApiRequestState<T> = {
  data: T | null;
  error: Result<T> | null;
  loading: boolean;
};

export function useApiRequest<T>(
  fetcher: () => Promise<Result<T>>,
  deps: React.DependencyList,
  enabled: boolean = true,
): UseApiRequestState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Result<T> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      startTransition(() => {
        setLoading(false);
        setData(null);
        setError(null);
      });
      return;
    }

    let cancelled = false;

    startTransition(() => {
      setLoading(true);
      setData(null);
      setError(null);
    });

    fetcher().then((result) => {
      if (cancelled) return;
      startTransition(() => {
        setLoading(false);
        if (result.success) {
          setData(result.data ?? null);
        } else {
          setError(result);
        }
      });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return { data, error, loading };
}
