export const NONE_VALUE = "__none__";

export function toSelectValue(value) {
	return value === null || value === undefined ? NONE_VALUE : String(value);
}

export function fromSelectValue(value) {
	return value === NONE_VALUE ? null : value;
}
