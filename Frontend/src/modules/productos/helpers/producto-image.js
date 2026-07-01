import { API_BASE_URL } from "../../../services/api";

function getApiOrigin() {
	if (typeof window === "undefined") {
		return "";
	}

	try {
		return new URL(API_BASE_URL, window.location.origin).origin;
	} catch {
		return window.location.origin;
	}
}

export function resolveProductoImageUrl(imagePath) {
	if (!imagePath) return "";
	if (/^https?:\/\//i.test(imagePath) || imagePath.startsWith("data:")) {
		return imagePath;
	}

	const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
	return `${getApiOrigin()}${normalizedPath}`;
}

export default resolveProductoImageUrl;
