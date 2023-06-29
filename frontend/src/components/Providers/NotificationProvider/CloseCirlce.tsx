import Close from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import styles from "./closeCircle.module.scss";

interface Props {
  onClick: () => void;
  timeout: number;
}

export default function CloseCircle({ onClick, timeout }: Props): JSX.Element {
  const radius = 45;
  const circumference = Math.ceil(2 * Math.PI * radius);

  return (
    <div className={styles.CloseCircle_wrapper} onClick={onClick}>
      <svg
        className={styles.CloseCircle_innerCircle}
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r={radius} fill="transparent" />
      </svg>
      <svg className={styles.CloseCirlce_outerCircle} viewBox="0 0 100 100">
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          transition={{ duration: timeout / 1000 + 0.05, ease: "easeIn" }}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: circumference }}
        />
      </svg>
      <Close className={styles.CloseCircle_closeIcon}/>
    </div>
  );
}
