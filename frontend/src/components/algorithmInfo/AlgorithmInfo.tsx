import { ProfilingAlgorithm } from "@/model/profilingAlgorithm";
import MartincAlgorithmInfo from "./MartincAlgorithmInfo";
import GrivasAlgorithmInfo from "./GrivasAlgorithmInfo";

interface Props {
  algorithm: ProfilingAlgorithm;
}

export default function AlgorithmInfo({ algorithm }: Props) {
  if (algorithm === "martinc") return <MartincAlgorithmInfo />;
  if (algorithm === "grivas") return <GrivasAlgorithmInfo />;
  return <></>;
}
