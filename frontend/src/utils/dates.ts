export function getCurrentYear() {
	return new Date().getFullYear();
}

export function getCurrentDecade() {
	return Math.floor(getCurrentYear() / 10) * 10;
}

export function getMinDecade() {
	return getCurrentDecade() - 90;
}
