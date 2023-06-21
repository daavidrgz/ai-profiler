import { ProfilingDataDto, ProfilingDataDtoSchema } from "@/model/profilingDataDto";

export default abstract class ProfilingService {
	private static endpoint = "/api";

	public static autoprofile(dataset: File): Promise<string> {
		const formData = new FormData();
		formData.append("file", dataset);

		return fetch(`${this.endpoint}/autoprofile`, {
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

	public static getProfilingData(profilingId: string): Promise<ProfilingDataDto> {
		return fetch(`${this.endpoint}/autoprofile/${profilingId}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.detail) {
					throw new Error(data.detail);
				}
				return ProfilingDataDtoSchema.parse(data);
			});
	};
}
