import { Age, AgeSchema } from "@/model/age";
import { Fame, FameSchema } from "@/model/fame";
import { Gender } from "@/model/gender";
import { OccupationSchema } from "@/model/occupation";
import { PersonalityTraitSchema } from "@/model/personalityTrait";

export function getGenderColors() {
	return [
		"#98EECC",
		"#79E0EE",
	]
}

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

export function getOccupationColors() {
	return [
		"#FFB97F",
		"#FFE77F",
		"#FF7F7F",
		"#7B9FFF",
		"#A17BFF",
		"#6FC3FF",
		"#D67BFF",
		"#FF7BDC",
	]
}

export function getOccupationColor(occupation: string) {
	const colors = getOccupationColors();
	const index = Object.keys(OccupationSchema.Enum).indexOf(occupation);
	return colors[index];
}

export function getPersonalityTraitColors() {
	return [
		"#FF7F7F",
		"#7B9FFF",
		"#A17BFF",
		"#6FC3FF",
		"#D67BFF",
	]
}

export function getPersonalityTraitColor(trait: string) {
	const colors = getPersonalityTraitColors();
	const index = Object.keys(PersonalityTraitSchema.Enum).indexOf(trait);
	return colors[index];
}
