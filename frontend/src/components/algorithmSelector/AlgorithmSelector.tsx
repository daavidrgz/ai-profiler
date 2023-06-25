import { ProfilingAlgorithm } from "@/model/algorithm";
import { motion } from "framer-motion";
import styles from "./algorithmSelector.module.scss";
import AlgorithmInfo from "../algorithmInfo/AlgorithmInfo";
import { Tooltip } from "react-tooltip";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";

interface Props {
  setAlgorithm: (algorithm: ProfilingAlgorithm) => void;
}

export default function AlgorithmSelector({ setAlgorithm }: Props) {
  return (
    <motion.div
      key="algithmSelector"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={styles.container}
    >
      <h2 className={styles.title}>SELECT YOUR ALGORITHM</h2>
      <div className={styles.algorithmsContainer}>
        <div
          className={styles.algorithmCard}
          data-tooltip-id="martinc-tooltip"
          onClick={() => setAlgorithm("martinc_celebrity")}
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
            delayShow={1000}
          >
            <AlgorithmInfo algorithm={"martinc_celebrity"} />
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
}
