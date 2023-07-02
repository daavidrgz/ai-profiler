import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import styles from "./charts.module.scss";
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
    tooltip: {
      backgroundColor: "#252734",
      titleColor: "#E3E6EF",
      bodyColor: "#E3E6EF",
      padding: 12,
      displayColors: false,
      titleFont: {
        size: 12,
        weight: "bold",
      },
      bodyFont: {
        size: 12,
      },
    },
  },
  scales: {
    y: {
      grid: {
        color: "#252734",
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
      borderRadius: 8,
    },
  },
  datasets: {
    bar: {
      barThickness: 35,
    },
  },
};

const pieChartOptions = {
  plugins: {
    legend: {
      labels: {
        boxWidth: 10,
        color: "#E3E6EF",
        font: {
          size: 9.5,
          weight: "bold",
        },
      },
    },
    tooltip: {
      backgroundColor: "#252734",
      displayColors: false,
      titleColor: "#E3E6EF",
      bodyColor: "#E3E6EF",
      padding: 12,
      titleFont: {
        size: 12,
        weight: "bold",
      },
      bodyFont: {
        size: 12,
      },
    },
  },
};

interface Props extends DivProps {
  people: Person[];
  selectedPerson: Person | null;
  title: string;
  label: string;
  entityEnum: any;
  colors: string[];
  chartType: "pie" | "bar" | "doughnut";
  attribute?: "gender" | "age" | "fame" | "occupation";
  filtered?: boolean;
  dimmable?: boolean;
  data?: any[];
  noContentMessage?: string;
  chartOptions?: any;
  direction?: "vertical" | "horizontal";
}

export default function Chart({
  people,
  selectedPerson,
  title,
  label,
  entityEnum,
  data,
  colors,
  chartType,
  children,
  attribute,
  filtered = false,
  dimmable = false,
  noContentMessage,
  chartOptions,
  direction = "vertical",
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

  // const filteredLabels = labels.filter((_, i) => dataset[i] > 0);
  // const filteredDataset = dataset.filter((d) => d > 0);

  const chartData = useMemo(() => {
    return {
      labels: labels,
      datasets: [
        {
          label: label,
          data: dataset,
          backgroundColor: [...colors],
          borderWidth: 1.5,
          borderColor: "#1e202c",
        },
      ],
    };
  }, [dataset, labels, colors, label]);

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
    <div className={styles.card} {...rest}>
      <h2 className={styles.title}>
        <ArrowRightRoundedIcon />
        <span>{title}</span>
      </h2>
      <div className={styles.contentWrapper} data-direction={direction}>
        <div className={styles.chartContainer}>
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
            <h3>{noContentMessage}</h3>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
