import { Tooltip } from "react-tooltip";
import AlgorithmInfo from "../algorithmInfo/AlgorithmInfo";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import styles from "./algorithmCard.module.scss";
import { ProfilingAlgorithm } from "@/model/algorithm";

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
      onClick={() => !readonly && setAlgorithm!("martinc_celebrity")}
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
            <span> • Birth Decade</span>
            <TodayRoundedIcon />
          </li>
        </ul>
      </div>
      <Tooltip
        id="martinc-tooltip"
        place="bottom"
        className={styles.algorithmTooltip}
        clickable
        delayShow={readonly ? 0 : 1000}
      >
        <AlgorithmInfo algorithm={"martinc_celebrity"} />
      </Tooltip>
    </div>
  );
}
