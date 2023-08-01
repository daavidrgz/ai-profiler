import { ProfilingAlgorithm } from "@/model/profilingAlgorithm";
import { ProfilingDto, ProfilingDtoSchema } from "@/model/profilingDto";

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
				return data.id;
			});
	};

	public static predictTwitter(username: string, algorithm: ProfilingAlgorithm): Promise<string> {
		return fetch(`${this.endpoint}/predict/twitter?algorithm=${algorithm}&user=${username}`, {
			method: "POST"
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.detail) {
					throw new Error(data.detail);
				}
				return data.id;
			});
	};

	public static getProfiling(profilingId: string): Promise<ProfilingDto> {
		return fetch(`${this.endpoint}/profilings/${profilingId}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.detail) {
					throw new Error(data.detail);
				}
				return ProfilingDtoSchema.parse(data);
			});
	};
}
