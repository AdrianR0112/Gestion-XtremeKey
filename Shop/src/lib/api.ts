const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
    ...options,
    cache: "no-store",
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    body: isFormData || options.body === undefined ? (options.body as BodyInit | null | undefined) : JSON.stringify(options.body),
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(typeof payload === "object" && payload && "message" in payload ? String(payload.message) : "Request failed");
  }

  return payload as T;
}

export { API_BASE_URL };
