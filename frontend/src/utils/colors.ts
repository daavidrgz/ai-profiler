import Gender, { GenderSchema } from "@/model/gender";

export function getGenderColor(gender: Gender) {
	if (gender === GenderSchema.Enum.male) {
		return "#98EECC";
	} else if (gender === GenderSchema.Enum.female) {
		return "#79e0ee";
	} else {
		return "#F9F9F9";
	}
}

export function getDecadeColors() {
	return [
		"#98EECC",
		"#79E0EE",
		"#6FC3FF",
		"#7B9FFF",
		"#A17BFF",
		"#D67BFF",
		"#FF7BDC",
		"#FF7F7F",
		"#FFB97F",
		"#FFE77F",
	]
}

export function getDecadeColor(decade: number, minDecade: number) {
	decade = decade - minDecade;
	const colors = getDecadeColors();
	return colors[decade / 10];
}
