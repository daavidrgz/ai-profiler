import Head from "next/head";
import styles from "@/pages/styles/results.module.scss";
import GenderChart from "@/components/Charts/GenderChart";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import AgeChart from "@/components/Charts/AgeChart";
import PeopleList from "@/components/Charts/PeopleList/PeopleList";
import { useState } from "react";
import ProfilingResume from "@/components/Charts/ProfilingResume/ProfilingResume";
import { useData } from "@/components/Providers/DataProvider/DataProvider";
import NavBar from "@/components/UI/NavBar/NavBar";
import FameChart from "@/components/Charts/FameChart";
import { grivasData, martincData, bigMartincData } from "@/utils/mocks";
import { Person } from "@/model/person";
import OccupationChart from "@/components/Charts/OccupationChart";
import PersonalityTraitsChart from "@/components/Charts/PersonalityTraitsChart";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useRouter } from "next/router";

Chart.register(CategoryScale);

export default function ResumePage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const router = useRouter();
  // const { data } = useData();
  const data = martincData;

  if (!data)
    return (
      <>
        <NavBar />
        <div className={styles.noContent}>
          <span className={styles.noContentTitle}>NOTHING TO SHOW</span>
          <span className={styles.noContentDescription}>
            Please, go back and upload a valid dataset
          </span>
        </div>
      </>
    );

  return (
    <>
      <Head>
        <title>AIProfiler</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <NavBar /> */}
      <main className={styles.main}>
        <h1 className={styles.title}>
          <div
            className={styles.goBackContainer}
            data-tooltip-id="go-back"
            onClick={() => router.push("/")}
          >
            <ArrowBackRoundedIcon />
          </div>
          RESULTS OVERVIEW
        </h1>

        <div className={styles.chartsContainer}>
          <div className={styles.firstRow}>
            <ProfilingResume
              profilingData={data}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className={styles.secondRow}>
            <PeopleList
              algorithm={data.algorithm}
              people={data.people}
              selectedPerson={selectedPerson}
              setSelectedPerson={setSelectedPerson}
              style={{ width: "56rem", height: "100%" }}
            />
            <AgeChart
              people={data.people}
              selectedPerson={selectedPerson}
              style={{ width: "36rem", height: "100%" }}
            />
            <GenderChart
              people={data.people}
              selectedPerson={selectedPerson}
              style={{ width: "18rem", height: "100%" }}
            />
          </div>

          <div className={styles.thirdRow}>
            {data.algorithm === "martinc" && (
              <>
                <FameChart
                  people={data.people}
                  selectedPerson={selectedPerson}
                  style={{ width: "25rem", height: "100%" }}
                />
                <OccupationChart
                  people={data.people}
                  selectedPerson={selectedPerson}
                  style={{ width: "26rem", height: "100%" }}
                />
              </>
            )}
            {data.algorithm === "grivas" && (
              <PersonalityTraitsChart
                people={data.people}
                selectedPerson={selectedPerson}
                style={{ width: "34rem", height: "100%" }}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
