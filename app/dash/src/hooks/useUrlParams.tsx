import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface IUseUrlParams<T> {
  permanentParams?: Array<keyof T>;
}

const useUrlSearchParams = <T extends object>({
  permanentParams = [],
}: IUseUrlParams<T> = {}) => {
  const { replace } = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const [paramsObj, setParamsObj] = useState<T>({} as T);

  const baseParams = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );

  const isFiltered = useMemo(() => {
    const paramsWithoutPermanent = Array.from(
      new Map(searchParams.entries())
    ).filter(([key]) => {
      return !permanentParams.includes(key as any);
    });

    return paramsWithoutPermanent && paramsWithoutPermanent.length > 0;
  }, [searchParams, permanentParams]);

  const applyUrlParams = useCallback(() => {
    replace(`${path}?${baseParams.toString()}`);
  }, [replace, path, baseParams]);

  const setUrlSearchParam = useCallback(
    (key: string, value?: string) => {
      if (permanentParams.find((item) => item === key)) return;

      setParamsObj((prev) => ({ ...prev, [key]: value }));
      let shouldApply = false;

      if (value) {
        baseParams.set(key, value);
      } else {
        baseParams.delete(key);
        shouldApply = true;
      }

      if (shouldApply) applyUrlParams();
    },
    [applyUrlParams, baseParams, permanentParams]
  );

  const clearUrlSearchParams = useCallback(() => {
    if (!paramsObj) return;

    Object.keys(paramsObj).forEach((key: any) => {
      if (permanentParams.find((item) => item === key)) return;
      setUrlSearchParam(key, undefined);
    });
  }, [paramsObj, permanentParams, setUrlSearchParam]);

  useEffect(() => {
    if (!baseParams.toString().length) return;

    const param: { [key: string]: string } = {};

    Array.from(baseParams.entries()).forEach(([key, value]) => {
      param[key] = value;
    });

    setParamsObj(param as T);
  }, [baseParams]);

  const updatedUrlParams = useMemo(() => {
    const paramsObject: { [key: string]: string } = {};

    Array.from(baseParams.entries()).forEach(([key, value]) => {
      if (value) paramsObject[key] = value;
    });

    return paramsObject as T;
  }, [baseParams]);

  return {
    isFiltered,
    urlParams: paramsObj || updatedUrlParams,
    applyUrlParams,
    setUrlSearchParam,
    clearUrlSearchParams,
  };
};

export default useUrlSearchParams;
