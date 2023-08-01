import { GenderSchema } from "@/model/gender";
import { OccupationSchema } from "@/model/occupation";
import { toProfilingData } from "@/model/profilingDataDto";
import { getRandomItem } from "./utils";
import { FameSchema } from "@/model/fame";
import { AgeSchema } from "@/model/age";

export const martincData = toProfilingData({
	id: "1234",
	status: "SUCCESS",
	algorithm: "martinc",
	time: 4810,
	output: [
		{
			id: "Juan",
			result: {
				gender: "male",
				fame: "rising",
				occupation: "performer",
				age: "35-49",
			},
		},
		{
			id: "Marta",
			result: {
				gender: "male",
				fame: "star",
				occupation: "performer",
				age: "18-24",
			},
		},
		{
			id: "Sara",
			result: {
				gender: "male",
				fame: "star",
				occupation: "performer",
				age: "50-XX",
			},
		},
		{
			id: "Ana",
			result: {
				gender: "male",
				fame: "star",
				occupation: "politics",
				age: "35-49",
			},
		},
		{
			id: "Luis",
			result: {
				gender: "male",
				fame: "star",
				occupation: "performer",
				age: "25-34",
			},
		},
		{
			id: "Pablo",
			result: {
				gender: "male",
				fame: "star",
				occupation: "creator",
				age: "50-XX",
			},
		},
		{
			id: "Javier",
			result: {
				gender: "male",
				fame: "star",
				occupation: "creator",
				age: "35-49",
			},
		},
		{
			id: "Carlos",
			result: {
				gender: "female",
				fame: "star",
				occupation: "performer",
				age: "25-34",
			},
		},
		{
			id: "David",
			result: {
				gender: "male",
				fame: "superstar",
				occupation: "sports",
				age: "35-49",
			},
		},
		{
			id: "Miguel",
			result: {
				gender: "male",
				fame: "star",
				occupation: "creator",
				age: "50-XX",
			},
		},
		{
			id: "Antonio",
			result: {
				gender: "female",
				fame: "star",
				occupation: "sports",
				age: "25-34",
			},
		},
		{
			id: "Jose",
			result: {
				gender: "female",
				fame: "star",
				occupation: "performer",
				age: "25-34",
			},
		},
		{
			id: "Angel",
			result: {
				gender: "male",
				fame: "star",
				occupation: "politics",
				age: "50-XX",
			},
		},
		{
			id: "Fernando",
			result: {
				gender: "male",
				fame: "star",
				occupation: "sports",
				age: "50-XX",
			},
		},
		{
			id: "Francisco",
			result: {
				gender: "male",
				fame: "star",
				occupation: "sports",
				age: "18-24",
			},
		},
		{
			id: "Jose Antonio",
			result: {
				gender: "male",
				fame: "star",
				occupation: "sports",
				age: "25-34",
			},
		},
		{
			id: "Enrique",
			result: {
				gender: "male",
				fame: "star",
				occupation: "sports",
				age: "50-XX",
			},
		},
	],
});

export const grivasData = toProfilingData({
	id: "12345",
	"status": "SUCCESS",
	"algorithm": "grivas",
	"time": 13217,
	"output": [
		{
			"id": "18506",
			"result": {
				"age": "25-34",
				"gender": "male",
				"extroverted": 0.22100027613675452,
				"stable": -0.2040631232231705,
				"agreeable": 0.13269129939297913,
				"conscientious": 0.3193569148594954,
				"open": 0.2894681688153367
			}
		},
		{
			"id": "29502",
			"result": {
				"age": "25-34",
				"gender": "male",
				"extroverted": 0.1558899786867888,
				"stable": 0.10863954400848448,
				"agreeable": 0.12368983409091604,
				"conscientious": 0.17416120495151818,
				"open": 0.29226980750412723
			}
		},
		{
			"id": "38991",
			"result": {
				"age": "25-34",
				"gender": "female",
				"extroverted": 0.1984239737944075,
				"stable": 0.0892439785811235,
				"agreeable": 0.1614603125776558,
				"conscientious": 0.23558853803010973,
				"open": 0.37820109361409276
			}
		},
		{
			"id": "3106",
			"result": {
				"age": "25-34",
				"gender": "male",
				"extroverted": 0.12462021580015292,
				"stable": 0.08090061772078451,
				"agreeable": 0.14075338929499884,
				"conscientious": 0.1538546864909911,
				"open": 0.27763574864664364
			}
		},
		{
			"id": "12766",
			"result": {
				"age": "25-34",
				"gender": "male",
				"extroverted": 0.199538134022261,
				"stable": 0.1392083576258513,
				"agreeable": 0.10054360623692637,
				"conscientious": 0.1487622136396517,
				"open": 0.2657490692109235
			}
		},
		{
			"id": "22313",
			"result": {
				"age": "25-34",
				"gender": "male",
				"extroverted": 0.13574110547020524,
				"stable": 0.1357172201693796,
				"agreeable": 0.11384021797333227,
				"conscientious": 0.17348740368096477,
				"open": 0.3199077127580839
			}
		},
		{
			"id": "39097",
			"result": {
				"age": "25-34",
				"gender": "female",
				"extroverted": 0.12826246966753557,
				"stable": 0.0520770189138311,
				"agreeable": 0.11059572125120534,
				"conscientious": 0.20270294891835874,
				"open": 0.328941180739196
			}
		},
		{
			"id": "6476",
			"result": {
				"age": "25-34",
				"gender": "female",
				"extroverted": 0.18178321054020913,
				"stable": 0.1974578880922468,
				"agreeable": 0.16441667408562155,
				"conscientious": 0.20384046958422813,
				"open": 0.3512291848752719
			}
		},
		{
			"id": "40241",
			"result": {
				"age": "25-34",
				"gender": "male",
				"extroverted": 0.12620966787518662,
				"stable": 0.09930669098332034,
				"agreeable": 0.11477933467047197,
				"conscientious": 0.14758123186724337,
				"open": 0.22938567723891856
			}
		},
		{
			"id": "39296",
			"result": {
				"age": "25-34",
				"gender": "female",
				"extroverted": 0.16313998077189784,
				"stable": 0.05204070147128015,
				"agreeable": 0.15796773474681217,
				"conscientious": 0.16815115757934507,
				"open": 0.35524717392061333
			}
		},
		{
			"id": "4425",
			"result": {
				"age": "25-34",
				"gender": "male",
				"extroverted": 0.17316445790562057,
				"stable": 0.2340378189237854,
				"agreeable": 0.2044786712796688,
				"conscientious": 0.15779779791245552,
				"open": 0.2837447725080922
			}
		},
		{
			"id": "12080",
			"result": {
				"age": "25-34",
				"gender": "male",
				"extroverted": 0.19970402458073014,
				"stable": 0.15472999801622828,
				"agreeable": 0.19363006322733872,
				"conscientious": 0.20641467054034165,
				"open": 0.27791660668370544
			}
		},
		{
			"id": "13626",
			"result": {
				"age": "18-24",
				"gender": "female",
				"extroverted": 0.2304036853882785,
				"stable": 0.06245669895076511,
				"agreeable": 0.11256639085682348,
				"conscientious": 0.2121911122012986,
				"open": 0.3126828261726988
			}
		},
		{
			"id": "19033",
			"result": {
				"age": "18-24",
				"gender": "female",
				"extroverted": 0.11436399373263686,
				"stable": -0.08031527702336608,
				"agreeable": 0.07548648426345612,
				"conscientious": 0.24663644972327395,
				"open": 0.3616878593156976
			}
		},
		{
			"id": "35810",
			"result": {
				"age": "25-34",
				"gender": "male",
				"extroverted": 0.22261181955696505,
				"stable": 0.17560855098693362,
				"agreeable": 0.17956956701133128,
				"conscientious": 0.18043006921544405,
				"open": 0.24079153489797092
			}
		},
		{
			"id": "41233",
			"result": {
				"age": "25-34",
				"gender": "female",
				"extroverted": 0.1882365772780582,
				"stable": 0.03359820189570839,
				"agreeable": 0.06988955376107292,
				"conscientious": 0.18494685071982359,
				"open": 0.3085299404560944
			}
		},
		{
			"id": "4189",
			"result": {
				"age": "25-34",
				"gender": "male",
				"extroverted": 0.1627856205664298,
				"stable": 0.15340512887585278,
				"agreeable": 0.16281371335081946,
				"conscientious": 0.1542794425022625,
				"open": 0.3515716734782056
			}
		},
		{
			"id": "35492",
			"result": {
				"age": "18-24",
				"gender": "female",
				"extroverted": 0.12822964505950846,
				"stable": 0.13863498841421135,
				"agreeable": 0.18402125064435093,
				"conscientious": 0.1743479899033199,
				"open": 0.4155723435874946
			}
		},
		{
			"id": "21546",
			"result": {
				"age": "25-34",
				"gender": "male",
				"extroverted": 0.1422349936397213,
				"stable": 0.11849360473475483,
				"agreeable": 0.22489190400283468,
				"conscientious": 0.1573321536630577,
				"open": 0.166581141456762
			}
		},
		{
			"id": "47432",
			"result": {
				"age": "25-34",
				"gender": "male",
				"extroverted": 0.1471156474798615,
				"stable": 0.18618489566000657,
				"agreeable": 0.1414183218156079,
				"conscientious": 0.16376661123569067,
				"open": 0.33767830238316743
			}
		},
		{
			"id": "24690",
			"result": {
				"age": "25-34",
				"gender": "female",
				"extroverted": 0.14549052475631363,
				"stable": -0.022219211839327402,
				"agreeable": 0.08496085500759154,
				"conscientious": 0.20396400385390298,
				"open": 0.33644114582859047
			}
		},
		{
			"id": "31466",
			"result": {
				"age": "18-24",
				"gender": "female",
				"extroverted": 0.12546100266338042,
				"stable": 0.006933914003248359,
				"agreeable": 0.11293741960374923,
				"conscientious": 0.1902519055818977,
				"open": 0.29649072952246885
			}
		},
		{
			"id": "37063",
			"result": {
				"age": "18-24",
				"gender": "female",
				"extroverted": 0.16558170727853438,
				"stable": 0.04600339102483744,
				"agreeable": 0.1106015675028532,
				"conscientious": 0.17065406592509494,
				"open": 0.31402611110930506
			}
		}
	]
});

const occupations = Object.values(OccupationSchema.Enum)
const genders = Object.values(GenderSchema.Enum)
const fames = Object.values(FameSchema.Enum)
const ages = Object.values(AgeSchema.Enum)

export const bigMartincData = toProfilingData({
	id: "12346",
	status: "SUCCESS",
	algorithm: "martinc",
	time: 4810,
	output: Array.from(Array(2500).keys()).map((_, i) => ({
		id: i.toString(),
		result: {
			gender: getRandomItem(genders),
			fame: getRandomItem(fames),
			occupation: getRandomItem(occupations),
			age: getRandomItem(ages),
		}
	}))
});
