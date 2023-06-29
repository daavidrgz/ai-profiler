import React, { useMemo } from "react";
import styles from "./genderChart.module.scss";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import { DivProps } from "@/utils/defaultInterfaces";
import { Person } from "@/model/person";
import { count } from "@/utils/formatter";
import Chart from "@/components/Charts/Chart";
import { GenderSchema } from "@/model/gender";
import { getGenderColors } from "@/utils/colors";

interface Props extends DivProps {
  people: Person[];
  selectedPerson: Person | null;
}

export default function GenderChart({
  people,
  selectedPerson,
  ...rest
}: Props) {
  const maleCount = useMemo(
    () => count(people, (person) => person.gender === "male"),
    [people]
  );

  const femaleCount = useMemo(
    () => count(people, (person) => person.gender === "female"),
    [people]
  );

  const maleRatio = useMemo(
    () => ((maleCount / people.length) * 100).toFixed(2),
    [maleCount, people.length]
  );

  const femaleRatio = useMemo(
    () => ((femaleCount / people.length) * 100).toFixed(2),
    [femaleCount, people.length]
  );

  return (
    <Chart
      gridArea="2 / 1 / 3 / 3"
      height="min(34vh, 45vw)"
      people={people}
      selectedPerson={selectedPerson}
      title={"GENDER DISTRIBUTION"}
      entityEnum={GenderSchema.Enum}
      colors={getGenderColors()}
      chartType="pie"
      attribute="gender"
      dimmable
      {...rest}
    >
      <div className={styles.genderCount}>
        <h3>
          <span>MALE</span>
          <MaleIcon />
        </h3>
        <div>
          <span className={styles.count}>{maleCount} </span>
          <span className={styles.percentage}>{maleRatio}%</span>
        </div>
      </div>
      <div className={styles.genderCount}>
        <h3>
          <span>FEMALE</span>
          <FemaleIcon />
        </h3>
        <div>
          <span className={styles.count}>{femaleCount} </span>
          <span className={styles.percentage}>{femaleRatio}%</span>
        </div>
      </div>
    </Chart>
  );
}
