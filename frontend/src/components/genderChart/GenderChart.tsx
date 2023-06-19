import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import styles from "./genderChart.module.scss";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import Person from "@/model/person";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import { DivProps } from "@/utils/defaultInterfaces";
import { GenderSchema } from "@/model/gender";

const chartOptions = {
  plugins: {
    legend: {
      labels: {
        color: "#E3E6EF",
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
  },
};

interface Props extends DivProps {
  people: Person[];
}

export default function GenderChart({ people, ...rest }: Props) {
  const maleCount = useMemo(
    () =>
      people.filter((person) => person.gender === GenderSchema.Enum.male)
        .length,
    [people]
  );

  const femaleCount = useMemo(
    () =>
      people.filter((person) => person.gender === GenderSchema.Enum.female)
        .length,
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

  const genderData = useMemo(() => {
    return {
      labels: ["Male", "Female"],
      datasets: [
        {
          label: "Number of people",
          data: [maleCount, femaleCount],
          backgroundColor: ["#98EECC", "#79E0EE"],
          borderWidth: 2,
          borderColor: "rgb(30, 32, 44)",
        },
      ],
    };
  }, [maleCount, femaleCount]);

  return (
    <div className={styles.card} {...rest}>
      <h2 className={styles.title}>
        <ArrowRightRoundedIcon />
        <span>GENDER DISTRIBUTION</span>
      </h2>
      <div className={styles.contentWrapper}>
        <div className={styles.chartContainer}>
          <Pie data={genderData} options={chartOptions} />
        </div>
        <div className={styles.dataContainer}>
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
        </div>
      </div>
    </div>
  );
}
