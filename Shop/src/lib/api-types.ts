export type ApiEnvelope<T> = {
  ok: boolean;
  message: string;
  data: T;
};

export type ApiListEnvelope<T> = {
  ok: boolean;
  message: string;
  data: T[];
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
};

export type ListQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined;
};

export function buildQuery(query?: ListQuery): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
