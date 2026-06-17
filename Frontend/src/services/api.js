const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

function normalizeErrorMessage(data) {
    if (typeof data === "string") return data.toLowerCase();
    if (data && typeof data === "object") return String(data.message || "").toLowerCase();
    return "";
}

function shouldRedirectToLogin(status, data) {
    const message = normalizeErrorMessage(data);

    return (
        status === 401
        && (
            message.includes("token invalido o expirado")
            || message.includes("token inválido o expirado")
        )
    );
}

function forceLoginRedirect() {
    if (typeof localStorage !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
    }

    if (typeof window !== "undefined" && window.location.pathname !== "/auth") {
        window.location.replace("/auth");
    }
}

async function request(path, options = {}) {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("authToken") : null;
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
    const headers = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers,
        ...options,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
        if (shouldRedirectToLogin(response.status, data)) {
            forceLoginRedirect();
        }

        const error = new Error(data?.message || "Request failed");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

export const api = {
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, body, options) =>
        request(path, {
            ...options,
            method: "POST",
            body: typeof FormData !== "undefined" && body instanceof FormData ? body : JSON.stringify(body),
        }),
    put: (path, body, options) =>
        request(path, {
            ...options,
            method: "PUT",
            body: typeof FormData !== "undefined" && body instanceof FormData ? body : JSON.stringify(body),
        }),
    patch: (path, body, options) =>
        request(path, {
            ...options,
            method: "PATCH",
            body: typeof FormData !== "undefined" && body instanceof FormData ? body : JSON.stringify(body),
        }),
    del: (path, options) => request(path, { ...options, method: "DELETE" }),
};

export default api;
export { API_BASE_URL, request };