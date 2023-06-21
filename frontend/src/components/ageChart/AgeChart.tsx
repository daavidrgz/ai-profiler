import { useMemo } from "react";
import styles from "./ageChart.module.scss";
import { Bar } from "react-chartjs-2";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CakeIcon from "@mui/icons-material/Cake";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import { DivProps } from "@/utils/defaultInterfaces";
import { getDecadeColors } from "@/utils/colors";
import { getCurrentYear, getMinDecade } from "@/utils/dates";
import { Person } from "@/model/person";

const chartOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      grid: {
        color: "rgb(41, 44, 58)",
      },
      ticks: {
        color: "#E3E6EF",
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#E3E6EF",
      },
    },
  },
};

interface Props extends DivProps {
  people: Person[];
}

export default function AgeChart({ people, ...rest }: Props) {
  const currentYear = getCurrentYear();
  const minDecade = getMinDecade();

  const medianDecade = useMemo(() => {
    const orderedDecades = people
      .map((person) => person.birthDecade)
      .sort((a, b) => a - b);
    const middleIndex = Math.floor(orderedDecades.length / 2);
    return orderedDecades[middleIndex];
  }, [people]);

  const maxMedianAge = currentYear - medianDecade;
  const minMedianAge = Math.max(maxMedianAge - 9, 0);

  const meanAge = useMemo(() => {
    const sum = people.reduce((acc, person) => acc + person.birthDecade, 0);
    const meanBirthYear = Math.floor(sum / people.length) + 5;
    return currentYear - meanBirthYear;
  }, [people, currentYear]);

  const ageData = useMemo(() => {
    const decadeGroups = [
      { label: `${minDecade}s`, count: 0 },
      { label: `${minDecade + 10}s`, count: 0 },
      { label: `${minDecade + 20}s`, count: 0 },
      { label: `${minDecade + 30}s`, count: 0 },
      { label: `${minDecade + 40}s`, count: 0 },
      { label: `${minDecade + 50}s`, count: 0 },
      { label: `${minDecade + 60}s`, count: 0 },
      { label: `${minDecade + 70}s`, count: 0 },
      { label: `${minDecade + 80}s`, count: 0 },
      { label: `${minDecade + 90}s`, count: 0 },
    ];

    people.forEach((person) => {
      const decadesDiff = (person.birthDecade - minDecade) / 10;
      decadeGroups[decadesDiff].count++;
    });

    return {
      labels: decadeGroups.map((group) => group.label),
      datasets: [
        {
          label: "Number of people",
          data: decadeGroups.map((group) => group.count),
          backgroundColor: getDecadeColors(),
        },
      ],
    };
  }, [people, minDecade]);

  return (
    <div className={styles.card} {...rest}>
      <h2 className={styles.title}>
        <ArrowRightRoundedIcon />
        <span>BIRTH DECADE DISTRIBUTION</span>
      </h2>
      <div className={styles.chartContainer}>
        <Bar data={ageData} options={chartOptions} />
      </div>
      <div className={styles.dataContainer}>
        <div className={styles.medianCard}>
          <h3>
            <span>MEDIAN DECADE</span>
            <DateRangeIcon />
          </h3>
          <span className={styles.medianDecade}>
            <span className={styles.number}>{medianDecade}</span>
            <span>s</span>
          </span>
          <span className={styles.medianYear}>
            {minMedianAge} - {maxMedianAge} y/o
          </span>
        </div>
        <div className={styles.meanCard}>
          <h3>
            <span>MEAN AGE</span>
            <CakeIcon />
          </h3>
          <span className={styles.meanAge}>
            <span className={styles.number}>{meanAge}</span>
            <span> y/o</span>
          </span>
        </div>
      </div>
    </div>
  );
}
