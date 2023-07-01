import { ProfilingAlgorithm } from "@/model/profilingAlgorithm";
import { ProfilingDataDto, ProfilingDataDtoSchema } from "@/model/profilingDataDto";

export default abstract class ProfilingService {
	private static endpoint = "/api";

	public static predict(dataset: File, algorithm: ProfilingAlgorithm): Promise<string> {
		const formData = new FormData();
		formData.append("file", dataset);

		return fetch(`${this.endpoint}/predict?algorithm=${algorithm}`, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.detail) {
					throw new Error(data.detail);
				}
				return data.profiling_id;
			});
	};

	public static predictUsername(username: string, algorithm: ProfilingAlgorithm): Promise<string> {
		return fetch(`${this.endpoint}/predict/twitter?algorithm=${algorithm}&user=${username}`, {
			method: "POST"
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.detail) {
					throw new Error(data.detail);
				}
				return data.profiling_id;
			});
	};

	public static getProfilingData(profilingId: string): Promise<ProfilingDataDto> {
		return fetch(`${this.endpoint}/profilings/${profilingId}`)
			.then((res) => res.json())
			.then((data) => {
				console.log(data)
				if (data.detail) {
					throw new Error(data.detail);
				}
				return ProfilingDataDtoSchema.parse(data);
			});
	};
}
