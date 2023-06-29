import React, { useEffect, useMemo, useRef } from "react";
import { Pie } from "react-chartjs-2";
import styles from "./genderChart.module.scss";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import { DivProps } from "@/utils/defaultInterfaces";
import { GenderSchema } from "@/model/gender";
import { Person } from "@/model/person";
import { getGenderColors } from "@/utils/colors";
import { capitalize, count } from "@/utils/formatter";

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
  selectedPerson: Person | null;
}

export default function GenderChart({
  people,
  selectedPerson,
  ...rest
}: Props) {
  const chartRef = useRef<any>(null);

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

  const genderData = useMemo(() => {
    return {
      labels: Object.keys(GenderSchema.Enum).map((label) => capitalize(label)),
      datasets: [
        {
          label: "Number of people",
          data: Object.values(GenderSchema.Enum).map((gender) =>
            count(people, (person) => person.gender === gender)
          ),
          backgroundColor: getGenderColors(),
          borderWidth: 2,
          borderColor: "rgb(30, 32, 44)",
        },
      ],
    };
  }, [people]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;

    chart.data.datasets[0].backgroundColor = getGenderColors();
    if (selectedPerson) {
      const index = Object.values(GenderSchema.Enum).indexOf(
        selectedPerson.gender
      );
      chart.data.datasets[0].backgroundColor = getGenderColors().map(
        (color, i) => (i === index ? color : color + "66")
      );
    }
    chart.update();
  }, [selectedPerson]);

  return (
    <div className={styles.card} {...rest}>
      <h2 className={styles.title}>
        <ArrowRightRoundedIcon />
        <span>GENDER DISTRIBUTION</span>
      </h2>
      <div className={styles.contentWrapper}>
        <div className={styles.chartContainer}>
          <Pie ref={chartRef} data={genderData} options={chartOptions} />
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
