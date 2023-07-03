import { Age, AgeSchema } from "@/model/age";
import { Fame, FameSchema } from "@/model/fame";
import { Gender, GenderSchema } from "@/model/gender";
import { OccupationSchema } from "@/model/occupation";
import { PersonalityTraitSchema } from "@/model/personalityTrait";

export function getGenderColors() {
	return [
		"#92e0ac",
		"#c0edcf",
		"#e1fcea",
	]
}

export function getGenderColor(gender: Gender) {
	const colors = getGenderColors();
	const index = Object.keys(GenderSchema.Enum).indexOf(gender)
	return colors[index];
}

export function getAgeColors() {
	return [
		"#98eecc",
		"#57d5cb",
		"#00bacc",
		"#009ecb",
		"#0080c2",
	]
}

export function getAgeColor(age: Age) {
	const colors = getAgeColors();
	const index = Object.keys(AgeSchema.Enum).indexOf(age)
	return colors[index];
}

export function getFameColors() {
	return [
		"#917FB3",
		"#E5BEEC",
		"#FDE2F3",
	]
}

export function getFameColor(fame: Fame) {
	const colors = getFameColors();
	const index = Object.keys(FameSchema.Enum).indexOf(fame)
	return colors[index];
}

export function getOccupationColors() {
	return [
		"#f5d4c3",
		"#fac597",
		"#f7b47a",
		"#f4a661",
		"#f49c4f",
		"#f1913e",
		"#ca7d3a",
		"#ce8749"
	]
}

export function getOccupationColor(occupation: string) {
	const colors = getOccupationColors();
	const index = Object.keys(OccupationSchema.Enum).indexOf(occupation);
	return colors[index];
}

export function getPersonalityTraitColors() {
	return [
		"#9491E2",
		"#9BA9E0",
		"#A2C2DD",
		"#A8DADB",
		"#AFF2D8",
	]
}

export function getPersonalityTraitColor(trait: string) {
	const colors = getPersonalityTraitColors();
	const index = Object.keys(PersonalityTraitSchema.Enum).indexOf(trait);
	return colors[index];
}
