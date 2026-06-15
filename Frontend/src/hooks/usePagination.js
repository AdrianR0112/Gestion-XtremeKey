import { useMemo } from "react";

export default function usePagination(items = [], page = 1, pageSize = 10) {
  return useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);
}
