import { ProfilingAlgorithm } from "@/model/algorithm";
import MartincAlgorithmInfo from "./MartincAlgorithmInfo";

interface Props {
  algorithm: ProfilingAlgorithm;
}

export default function AlgorithmInfo({ algorithm }: Props) {
  if (algorithm === "martinc_celebrity") {
    return <MartincAlgorithmInfo />;
  } else {
    return <></>;
  }
}
