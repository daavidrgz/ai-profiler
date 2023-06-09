import { Gender } from "@/model/person";

export function getGenderColor(gender: Gender) {
	if (gender === Gender.Male) {
		return "#98EECC";
	} else if (gender === Gender.Female) {
		return "#F9B5AC";
	} else {
		return "#F9F9F9";
	}
}
