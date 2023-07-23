import { useParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";
import { FilterOptions } from "../types";
import { fetcher } from "../utils";

export default function useFilter({
  filter,
}: { filter?: string | undefined } ) {
  const { data, error } = useSWR<FilterOptions[]>(
    `/api/filters?filter=${filter}`,
    fetcher
  );

  const filters = useMemo(() => {
    return data;
  }, [data]);

  return {
    filters,
   
    loading: !filters && !error,
    error,
  };
}
