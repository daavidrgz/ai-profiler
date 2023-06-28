import { ProfilingAlgorithm } from "@/model/profilingAlgorithm";
import MartincAlgorithmCard from "./MartincAlgorithmCard";
import GrivasAlgorithmCard from "./GrivasAlgorithmCard";

interface Props {
  algorithm: ProfilingAlgorithm;
}

export default function AlgorithmCard({ algorithm }: Props) {
  if (algorithm === "martinc") return <MartincAlgorithmCard readonly />;
  if (algorithm === "grivas") return <GrivasAlgorithmCard readonly />;
  return <></>;
}
