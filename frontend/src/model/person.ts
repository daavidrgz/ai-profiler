export enum Gender {
	Male = "Male",
	Female = "Female",
}

export default class Person {
	name: string;
	birthDecade: number;
	gender: Gender;

	constructor(name: string, birthDecade: number, gender: Gender) {
		this.name = name
		this.birthDecade = birthDecade
		this.gender = gender
	}
}
