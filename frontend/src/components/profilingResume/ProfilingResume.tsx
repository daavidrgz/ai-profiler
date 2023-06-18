import Person from "@/model/person";
import styles from "./profilingResume.module.scss";
import { DivProps } from "@/utils/defaultInterfaces";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';

interface Props extends DivProps {
  people: Person[];
}

export default function ProfilingResume({ people, ...rest }: Props) {
  return (
    <div className={styles.card} {...rest}>
      <div className={styles.title}>
        <ArrowRightRoundedIcon />
        <span>RESUME</span>
      </div>
      <div className={styles.dataContainer}>
        <div className={styles.totalCard}>
          <h3>
            <span>TOTAL</span>
            <PeopleAltRoundedIcon />
          </h3>
          <span className={styles.number}>{people.length}</span>
        </div>
        <div className={styles.timeCard}>
          <h3>
            <span>PROFILING TIME</span>
            <HourglassEmptyRoundedIcon />
          </h3>
          <span className={styles.number}>4m 19s</span>
        </div>
      </div>
    </div>
  );
}
