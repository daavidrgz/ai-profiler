import { Tooltip } from "react-tooltip";
import AlgorithmInfo from "../algorithmInfo/AlgorithmInfo";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import PsychologyAltRoundedIcon from "@mui/icons-material/PsychologyAltRounded";
import styles from "./algorithmCard.module.scss";
import { ProfilingAlgorithm } from "@/model/profilingAlgorithm";

interface Props {
  readonly?: boolean;
  setAlgorithm?: (algorithm: ProfilingAlgorithm) => void;
}

export default function GrivasAlgorithmCard({
  setAlgorithm,
  readonly = false,
}: Props) {
  return (
    <div
      data-readonly={readonly}
      className={styles.algorithmCard}
      data-tooltip-id="grivas-tooltip"
      onClick={() => !readonly && setAlgorithm!("grivas")}
    >
      <h3>Grivas Algorithm</h3>
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
            <span> • Personality Traits</span>
            <PsychologyAltRoundedIcon />
          </li>
        </ul>
      </div>
      <Tooltip
        id="grivas-tooltip"
        place="right"
        className={styles.algorithmTooltip}
        clickable
        delayShow={readonly ? 400 : 1000}
      >
        <AlgorithmInfo algorithm={"grivas"} />
      </Tooltip>
    </div>
  );
}
