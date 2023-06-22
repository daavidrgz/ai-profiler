import styles from "./profilingResume.module.scss";
import { DivProps } from "@/utils/defaultInterfaces";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import { formatTime } from "@/utils/formatter";
import FunctionsIcon from "@mui/icons-material/Functions";
import { Tooltip } from "react-tooltip";
import { ProfilingData } from "@/model/profilingData";
import ScoreTable from "../scoreTable/ScoreTable";
import AlgorithmInfo from "../algorithmInfo/AlgorithmInfo";

interface Props extends DivProps {
  profilingData: ProfilingData;
}

export default function ProfilingResume({ profilingData, ...rest }: Props) {
  return (
    <div className={styles.card} {...rest}>
      <div className={styles.title}>
        <ArrowRightRoundedIcon />
        <span>RESUME</span>
      </div>
      <div className={styles.dataContainer}>
        <div className={styles.totalCard} data-tooltip-id="total-tooltip">
          <h3>
            <span>TOTAL</span>
            <PeopleAltRoundedIcon />
          </h3>
          <span className={styles.number}>{profilingData.people.length}</span>
          <Tooltip
            id="total-tooltip"
            place="bottom"
            className={styles.totalTooltip}
            clickable
          >
            <h2>Total People</h2>
            <p>
              The total number of people that have been processed by the
              profiling algorithm.
            </p>
          </Tooltip>
        </div>
        <div className={styles.timeCard} data-tooltip-id="time-tooltip">
          <h3>
            <span>PROFILING TIME</span>
            <HourglassEmptyRoundedIcon />
          </h3>
          <span className={styles.number}>
            {formatTime(profilingData.time)}
          </span>
          <Tooltip
            id="time-tooltip"
            place="bottom"
            className={styles.timeTooltip}
            clickable
          >
            <h2>Profiling Time</h2>
            <p>
              The profiling time is the time it takes to process all the texts
              while generating the predictions.
              <br />
              <br />
              The time is calculated{" "}
              <span className="bold">
                from the moment the <span className="italic">predict()</span>{" "}
                function is called
              </span>{" "}
              in the backend until it ends and returns the output.
            </p>
          </Tooltip>
        </div>
        <div
          className={styles.algorithmCard}
          data-tooltip-id="algorithm-tooltip"
        >
          <h3>
            <span>ALGORITHM</span>
            <FunctionsIcon />
          </h3>
          <span className={styles.algorithmName}>
            {profilingData.algorithm}
          </span>
          <Tooltip
            id="algorithm-tooltip"
            place="bottom"
            className={styles.algorithmTooltip}
            clickable
          >
            <AlgorithmInfo algorithm={profilingData.algorithm} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
