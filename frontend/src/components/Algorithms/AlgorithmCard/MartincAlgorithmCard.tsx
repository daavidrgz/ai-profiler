import { Tooltip } from "react-tooltip";
import AlgorithmInfo from "../AlgorithmInfo/AlgorithmInfo";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import styles from "./algorithmCard.module.scss";
import { ProfilingAlgorithm } from "@/model/profilingAlgorithm";

interface Props {
  readonly?: boolean;
  setAlgorithm?: (algorithm: ProfilingAlgorithm) => void;
}

export default function MartincAlgorithmCard({
  setAlgorithm,
  readonly = false,
}: Props) {
  return (
    <div
      data-readonly={readonly}
      className={styles.algorithmCard}
      data-tooltip-id="martinc-tooltip"
      onClick={() => !readonly && setAlgorithm!("martinc")}
    >
      <h3>Martinc Algorithm</h3>
      <div className={styles.algorithmClasses}>
        <span>Includes profiling of:</span>
        <ul>
          <li>
            <span> • Gender</span>
            <WcRoundedIcon />
          </li>
          <li>
            <span> • Age</span>
            <TodayRoundedIcon />
          </li>
          <li>
            <span> • Fame</span>
            <StarRoundedIcon />
          </li>
          <li>
            <span> • Occupation</span>
            <WorkRoundedIcon />
          </li>
        </ul>
      </div>
      <Tooltip
        id="martinc-tooltip"
        place="right"
        className={styles.algorithmTooltip}
        clickable
        delayShow={readonly ? 400 : 1000}
      >
        <AlgorithmInfo algorithm={"martinc"} />
      </Tooltip>
    </div>
  );
}
