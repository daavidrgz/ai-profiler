import ProfilingData from "@/model/profilingData";
import { ProfilingDataDtoSchema, toProfilingData } from "@/model/profilingDataDto";

export default abstract class ProfilingService {
	private static endpoint = "/api";

	public static autoprofile(dataset: File): Promise<ProfilingData> {
		const formData = new FormData();
		formData.append("file", dataset);

		return fetch(`${this.endpoint}/autoprofile`, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				const profilingDataDto = ProfilingDataDtoSchema.parse(data);
				return toProfilingData(profilingDataDto);
			})
	};
}
