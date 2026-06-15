import { useMemo } from "react";

export default function useFilters(items = [], predicate = () => true) {
  return useMemo(() => items.filter(predicate), [items, predicate]);
}
