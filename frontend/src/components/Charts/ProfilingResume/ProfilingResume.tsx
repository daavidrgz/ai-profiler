import styles from "./profilingResume.module.scss";
import { DivProps } from "@/utils/defaultInterfaces";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import { capitalize, formatTime } from "@/utils/utils";
import FunctionsIcon from "@mui/icons-material/Functions";
import { Tooltip } from "react-tooltip";
import { ProfilingData } from "@/model/profilingData";
import AlgorithmInfo from "../../Algorithms/AlgorithmInfo/AlgorithmInfo";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import InfoCard from "../InfoCard/InfoCard";

interface Props extends DivProps {
  profilingData: ProfilingData;
}

export default function ProfilingResume({ profilingData, ...rest }: Props) {
  return (
    <div className={styles.card} {...rest}>
      <InfoCard
        title="TOTAL"
        icon={<PeopleOutlineRoundedIcon />}
        mainValue={profilingData.people.length}
        unselectable
        tooltip={
          <Tooltip
            id="total-tooltip"
            place="bottom"
            className={`${styles.totalTooltip} tooltip`}
            clickable
          >
            <h2>Total People</h2>
            <p>
              The total number of people that have been processed by the
              profiling algorithm.
            </p>
          </Tooltip>
        }
      />

      <InfoCard
        title="PROFILING TIME"
        icon={<HourglassEmptyRoundedIcon />}
        mainValue={formatTime(profilingData.time)}
        unselectable
        tooltip={
          <Tooltip
            id="time-tooltip"
            place="bottom"
            className={`${styles.timeTooltip} tooltip`}
            clickable
          >
            <h2>Profiling Time</h2>
            <p>
              The profiling time is the time it takes to process all the texts
              while generating the predictions.
              <span className="vSpace" />
              The time is calculated{" "}
              <span className="bold">
                from the moment the <span className="italic">predict()</span>{" "}
                function is called
              </span>{" "}
              in the backend until it ends and returns the output.
            </p>
          </Tooltip>
        }
      />

      <InfoCard
        title="ALGORITHM"
        icon={<FunctionsIcon />}
        mainValue={capitalize(profilingData.algorithm)}
        unselectable
        tooltip={
          <Tooltip
            id="algorithm-tooltip"
            place="bottom"
            className={`${styles.algorithmTooltip} tooltip`}
            clickable
          >
            <AlgorithmInfo algorithm={profilingData.algorithm} />
          </Tooltip>
        }
      />
    </div>
  );
}
