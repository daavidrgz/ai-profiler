import { Age, AgeSchema } from "@/model/age";
import { Fame, FameSchema } from "@/model/fame";
import { Gender } from "@/model/gender";

export function getGenderColor(gender: Gender) {
	if (gender === "male")
		return "#98EECC";
	if (gender === "female")
		return "#79e0ee";
}

export function getAgeColors() {
	return [
		"#98EECC",
		"#79E0EE",
		"#FF7F7F",
		"#7B9FFF",
		"#A17BFF",
		// "#FFB97F",
		// "#FFE77F",
	]
}

export function getAgeColor(age: Age) {
	const colors = getAgeColors();
	const index = Object.keys(AgeSchema.Enum).indexOf(age)
	return colors[index];
}

export function getFameColors() {
	return [
		"#6FC3FF",
		"#D67BFF",
		"#FF7BDC",
	]
}

export function getFameColor(fame: Fame) {
	const colors = getFameColors();
	const index = Object.keys(FameSchema.Enum).indexOf(fame)
	return colors[index];
}
