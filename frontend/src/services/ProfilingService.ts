import ProfilingDataDto from "@/model/profilingDataDto";

export default abstract class ProfilingService {
	public abstract autoprofile(): Promise<ProfilingDataDto>;
}
