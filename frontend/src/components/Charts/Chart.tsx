import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import styles from "./chart.module.scss";
import { useMemo, useRef, useEffect } from "react";
import { capitalize, count, mergeDeep } from "@/utils/formatter";
import { Person } from "@/model/person";
import { DivProps } from "@/utils/defaultInterfaces";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { AnimatePresence, motion } from "framer-motion";

const barChartOptions = {
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
  elements: {
    bar: {
      borderRadius: 10,
    },
  },
};

const pieChartOptions = {
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
  title: string;
  entityEnum: any;
  colors: string[];
  chartType: "pie" | "bar" | "doughnut";
  attribute?: "gender" | "age" | "fame" | "occupation";
  filtered?: boolean;
  height?: string | number;
  gridArea?: string;
  dimmable?: boolean;
  data?: any[];
  noContentMessage?: string;
  chartOptions?: any;
}

export default function Chart({
  people,
  selectedPerson,
  title,
  entityEnum,
  data,
  colors,
  chartType,
  children,
  attribute,
  filtered = false,
  height,
  gridArea,
  dimmable = false,
  noContentMessage,
  chartOptions,
  ...rest
}: Props) {
  const chartRef = useRef<any>(null);

  const dataset = useMemo(
    () =>
      data
        ? data
        : Object.values(entityEnum).map((prop) =>
            count(people, (person) => person[attribute!] === prop)
          ),
    [people, entityEnum, attribute, data]
  );

  const labels = useMemo(
    () => Object.keys(entityEnum).map((label) => capitalize(label)),
    [entityEnum]
  );

  const filteredLabels = labels.filter((_, i) => dataset[i] > 0);
  const filteredDataset = dataset.filter((d) => d > 0);

  const chartData = useMemo(() => {
    return {
      labels: filtered ? filteredLabels : labels,
      datasets: [
        {
          label: "Number of people",
          data: filtered ? filteredDataset : dataset,
          backgroundColor: [...colors],
          borderWidth: 3,
          borderColor: "#1e202c",
        },
      ],
    };
  }, [dataset, labels, colors, filtered, filteredDataset, filteredLabels]);

  useEffect(() => {
    if (!dimmable) return;

    if (!chartRef.current) return;
    const chart = chartRef.current;

    chart.data.datasets[0].backgroundColor = [...colors];
    if (selectedPerson) {
      const index = Object.values(entityEnum).indexOf(
        selectedPerson[attribute!]
      );
      chart.data.datasets[0].backgroundColor = [...colors].map((color, i) =>
        i === index ? color : color + "66"
      );
    }
    chart.update();
  }, [selectedPerson, colors, entityEnum, attribute, dimmable]);

  const fullBarChartOptions = mergeDeep(barChartOptions, chartOptions);
  const fullPieChartOptions = mergeDeep(pieChartOptions, chartOptions);

  return (
    <div className={styles.card} {...rest} style={{ gridArea: gridArea }}>
      <h2 className={styles.title}>
        <ArrowRightRoundedIcon />
        <span>{title}</span>
      </h2>
      <div className={styles.contentWrapper}>
        <div className={styles.chartContainer} style={{ height: height }}>
          {chartType === "pie" && (
            <Pie
              ref={chartRef}
              data={chartData}
              options={fullPieChartOptions}
            />
          )}
          {chartType === "bar" && (
            <Bar
              ref={chartRef}
              data={chartData}
              options={fullBarChartOptions}
            />
          )}
          {chartType === "doughnut" && (
            <Doughnut
              ref={chartRef}
              data={chartData}
              options={pieChartOptions}
            />
          )}
        </div>
        <div className={styles.dataContainer}>{children}</div>
      </div>
      <AnimatePresence>
        {dataset.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.noData}
          >
            <h3>NO DATA AVAILABLE</h3>
            <span>{noContentMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
