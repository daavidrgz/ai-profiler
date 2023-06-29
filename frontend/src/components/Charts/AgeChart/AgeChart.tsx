import { useMemo } from "react";
import styles from "./ageChart.module.scss";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { DivProps } from "@/utils/defaultInterfaces";
import { Person } from "@/model/person";
import { getAgeColors } from "@/utils/colors";
import { AgeSchema } from "@/model/age";
import Chart from "@/components/Charts/Chart";

interface Props extends DivProps {
  people: Person[];
  selectedPerson: Person | null;
}

export default function AgeChart({ people, selectedPerson, ...rest }: Props) {
  const medianAge = useMemo(() => {
    const ages = people.map((person) => person.age);
    ages.sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    const half = Math.floor(ages.length / 2);
    return ages[half];
  }, [people]);

  return (
    <Chart
      gridArea="2 / 3 / 4 / 6"
      height={"min(45vw, 45vh)"}
      people={people}
      selectedPerson={selectedPerson}
      title={"AGE DISTRIBUTION"}
      entityEnum={AgeSchema.Enum}
      colors={getAgeColors()}
      chartType="bar"
      attribute="age"
      dimmable
      {...rest}
    >
      <div className={styles.medianCard}>
        <h3>
          <span>MEDIAN AGE</span>
          <DateRangeIcon />
        </h3>
        <span className={styles.medianAge}>
          <span className={styles.number}>{medianAge}</span>
          <span>y/o</span>
        </span>
      </div>
    </Chart>
  );
}
