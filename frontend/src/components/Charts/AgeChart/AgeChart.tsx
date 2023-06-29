import { useMemo, useRef } from "react";
import styles from "./ageChart.module.scss";
import { Bar } from "react-chartjs-2";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CakeIcon from "@mui/icons-material/Cake";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import { DivProps } from "@/utils/defaultInterfaces";
import { Person } from "@/model/person";
import { getAgeColors } from "@/utils/colors";
import { AgeSchema } from "@/model/age";
import { count } from "@/utils/formatter";
import { useEffect } from "react";

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
  selectedPerson: Person | null;
}

export default function AgeChart({ people, selectedPerson, ...rest }: Props) {
  const chartRef = useRef<any>(null);

  const ageData = useMemo(() => {
    return {
      labels: Object.keys(AgeSchema.Enum),
      datasets: [
        {
          label: "Number of people",
          data: Object.values(AgeSchema.Enum).map((ageGroup) =>
            count(people, (person) => person.age === ageGroup)
          ),
          backgroundColor: getAgeColors(),
          borderRadius: 10,
        },
      ],
    };
  }, [people]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;

    chart.data.datasets[0].backgroundColor = getAgeColors();
    if (selectedPerson) {
      const index = Object.values(AgeSchema.Enum).indexOf(
        selectedPerson.age
      );
      chart.data.datasets[0].backgroundColor = getAgeColors().map(
        (color, i) => (i === index ? color : color + "66")
      );
    }
    chart.update();
  }, [selectedPerson]);

  return (
    <div className={styles.card} {...rest}>
      <h2 className={styles.title}>
        <ArrowRightRoundedIcon />
        <span>AGE DISTRIBUTION</span>
      </h2>
      <div className={styles.chartContainer}>
        <Bar ref={chartRef} data={ageData} options={chartOptions} />
      </div>
      <div className={styles.dataContainer}>
        {/* <div className={styles.medianCard}>
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
        </div> */}
      </div>
    </div>
  );
}
