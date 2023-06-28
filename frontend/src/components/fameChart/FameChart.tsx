import { FameSchema } from "@/model/fame";
import { Person } from "@/model/person";
import { getFameColors } from "@/utils/colors";
import { DivProps } from "@/utils/defaultInterfaces";
import { useMemo } from "react";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import styles from "./fameChart.module.scss";
import { Doughnut } from "react-chartjs-2";
import { capitalize } from "@/utils/formatter";

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

export default function FameChart({ people, ...rest }: Props) {
  const fameData = useMemo(() => {
    return {
      labels: Object.keys(FameSchema.Enum).map((label) => capitalize(label)),
      datasets: [
        {
          label: "Number of people",
          data: Object.values(FameSchema.Enum).map(
            (group) => people.filter((person) => person.fame === group).length
          ),
          backgroundColor: getFameColors(),
          borderWidth: 2,
          borderColor: "rgb(30, 32, 44)",
        },
      ],
    };
  }, [people]);

  console.log(fameData);

  return (
    <div className={styles.card} {...rest}>
      <div className={styles.title}>
        <ArrowRightRoundedIcon />
        <span>FAME DISTRIBUTION</span>
      </div>
      <div className={styles.chartContainer}>
        <Doughnut data={fameData} options={chartOptions} />
      </div>
    </div>
  );
}
