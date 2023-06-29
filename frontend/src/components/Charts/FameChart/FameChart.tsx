import { FameSchema } from "@/model/fame";
import { Person } from "@/model/person";
import { getFameColors } from "@/utils/colors";
import { DivProps } from "@/utils/defaultInterfaces";
import { useMemo, useRef, useEffect } from "react";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import styles from "./fameChart.module.scss";
import { Doughnut } from "react-chartjs-2";
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

export default function FameChart({ people, selectedPerson, ...rest }: Props) {
  const chartRef = useRef<any>(null);

  const fameData = useMemo(() => {
    return {
      labels: Object.keys(FameSchema.Enum).map((label) => capitalize(label)),
      datasets: [
        {
          label: "Number of people",
          data: Object.values(FameSchema.Enum).map((fame) =>
            count(people, (person) => person.fame === fame)
          ),
          backgroundColor: getFameColors(),
          borderWidth: 2,
          borderColor: "rgb(30, 32, 44)",
        },
      ],
    };
  }, [people]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;

    chart.data.datasets[0].backgroundColor = getFameColors();
    if (selectedPerson) {
      const index = Object.values(FameSchema.Enum).indexOf(
        selectedPerson.fame!
      );
      chart.data.datasets[0].backgroundColor = getFameColors().map((color, i) =>
        i === index ? color : color + "66"
      );
    }
    chart.update();
  }, [selectedPerson]);

  return (
    <div className={styles.card} {...rest}>
      <div className={styles.title}>
        <ArrowRightRoundedIcon />
        <span>FAME DISTRIBUTION</span>
      </div>
      <div className={styles.chartContainer}>
        <Doughnut ref={chartRef} data={fameData} options={chartOptions} />
      </div>
    </div>
  );
}
