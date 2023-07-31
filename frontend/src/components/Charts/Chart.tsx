import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import styles from "./charts.module.scss";
import { useMemo, useRef, useEffect } from "react";
import { capitalize, count, mergeDeep } from "@/utils/utils";
import { Person } from "@/model/person";
import { DivProps } from "@/utils/defaultInterfaces";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { AnimatePresence, motion } from "framer-motion";
import { montserrat } from "@/utils/fonts";

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 24,
    },
  },
  plugins: {
    datalabels: {
      align: "end",
      anchor: "end",
      color: function (context: any) {
        return context.dataset.backgroundColor;
      },
      font: { weight: "bold" },
      display: function (context: any) {
        return context.dataset.data[context.dataIndex] > 0;
      },
      formatter: function (value: number) {
        return Math.round(value * 100) / 100;
      },
    },
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#252734",
      titleColor: "#E3E6EF",
      bodyColor: "#E3E6EF",
      padding: 12.8,
      displayColors: false,
      titleFont: {
        size: 12.8,
        weight: "bold",
      },
      bodyFont: {
        size: 11.2,
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
        font: {
          size: 11.2,
          family: montserrat.style.fontFamily,
          weight: "500",
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#E3E6EF",
        font: {
          size: 11.2,
          family: montserrat.style.fontFamily,
          weight: "500",
        },
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
      display: false,
    },
    datalabels: {
      font: {
        weight: 700,
        size: 9,
        family: montserrat.style.fontFamily,
      },
      color: "#2d303e",
      display: function (context: any) {
        const value = context.dataset.data[context.dataIndex];
        const total = context.dataset.data.reduce(
          (a: number, b: number) => a + b,
          0
        );

        return value > total * 0.2;
      },
      formatter: function (_: any, context: any) {
        return context.chart.data.labels[context.dataIndex];
      },
    },
    tooltip: {
      backgroundColor: "#252734",
      displayColors: false,
      titleColor: "#E3E6EF",
      bodyColor: "#E3E6EF",
      padding: 12.8,
      titleFont: {
        size: 12.8,
        weight: "bold",
      },
      bodyFont: {
        size: 11.2,
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
        <div
          className={styles.chartContainer}
          style={{
            width: chartType === "bar" ? "100%" : "11rem",
            height: chartType === "bar" ? "100%" : "11rem",
          }}
        >
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
