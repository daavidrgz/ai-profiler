import { ChartData } from "chart.js";
import React from "react";
import { Pie } from "react-chartjs-2";
import styles from "./pieChart.module.scss";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";

interface Props {
  chartData: ChartData<"pie">;
}

export default function PieChart({ chartData }: Props) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>GENDER DISTRIBUTION</h2>
      <div className={styles.contentWrapper}>
        <div className={styles.chartContainer}>
          <Pie
            data={chartData}
            options={{
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
            }}
          />
        </div>
        <div className={styles.dataContainer}>
          <div className={styles.genderCount}>
            <h3>
              <span>MALE</span>
              <MaleIcon />
            </h3>
            <div>
              <span className={styles.count}>96 </span>
              <span className={styles.percentage}>40.1%</span>
            </div>
          </div>
          <div className={styles.genderCount}>
            <h3>
              <span>FEMALE</span>
              <FemaleIcon />
            </h3>
            <div>
              <span className={styles.count}>40 </span>
              <span className={styles.percentage}>65.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
