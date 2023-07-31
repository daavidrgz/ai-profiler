import Head from "next/head";
import styles from "@/pages/styles/results.module.scss";
import GenderChart from "@/components/Charts/GenderChart";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import AgeChart from "@/components/Charts/AgeChart";
import PeopleList from "@/components/Charts/PeopleList/PeopleList";
import { use, useEffect, useState } from "react";
import ProfilingResume from "@/components/Charts/ProfilingResume/ProfilingResume";
import NavBar from "@/components/UI/NavBar/NavBar";
import FameChart from "@/components/Charts/FameChart";
import { grivasData, martincData, bigMartincData } from "@/utils/mocks";
import { Person } from "@/model/person";
import OccupationChart from "@/components/Charts/OccupationChart";
import PersonalityTraitsChart from "@/components/Charts/PersonalityTraitsChart";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useRouter } from "next/router";
import { ProfilingData } from "@/model/profilingData";
import ProfilingService from "@/services/ProfilingService";
import { toProfilingData } from "@/model/profilingDataDto";
import { useNotifications } from "@/components/Providers/NotificationProvider/NotificationProvider";
import plugin from 'chartjs-plugin-datalabels';

Chart.register(CategoryScale);
Chart.register(plugin);

export default function ResumePage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [profilingData, setProfilingData] = useState<ProfilingData | null>(
    null
  );
  const [fetching, setFetching] = useState(false);

  const router = useRouter();
  const { createErrorNotification } = useNotifications();

  const { id } = router.query;

  useEffect(() => {
    setFetching(true);
    if (id && typeof id === "string") {
      ProfilingService.getProfiling(id)
        .then((profilingData) =>
          setProfilingData(toProfilingData(profilingData))
        )
        .catch((error) => {
          createErrorNotification(error.message, 5000);
        })
        .finally(() => setFetching(false));
    }
  }, [id, createErrorNotification]);

  if (fetching) {
    return;
  }

  if (!profilingData)
    return (
      <>
        <NavBar />
        <div className={styles.noContent}>
          <span className={styles.noContentTitle}>NOTHING TO SHOW</span>
          <span className={styles.noContentDescription}>
            Please, make sure the id is correct or go back and upload a new dataset
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
              profilingData={profilingData}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className={styles.secondRow}>
            <PeopleList
              algorithm={profilingData.algorithm}
              people={profilingData.people}
              selectedPerson={selectedPerson}
              setSelectedPerson={setSelectedPerson}
              style={{ width: "56rem", height: "100%" }}
            />
            <AgeChart
              people={profilingData.people}
              selectedPerson={selectedPerson}
              style={{ width: "36rem", height: "100%" }}
            />
            <GenderChart
              people={profilingData.people}
              selectedPerson={selectedPerson}
              style={{ width: "18rem", height: "100%" }}
            />
          </div>

          <div className={styles.thirdRow}>
            {profilingData.algorithm === "martinc" && (
              <>
                <FameChart
                  people={profilingData.people}
                  selectedPerson={selectedPerson}
                  style={{ width: "25rem", height: "100%" }}
                />
                <OccupationChart
                  people={profilingData.people}
                  selectedPerson={selectedPerson}
                  style={{ width: "50rem", height: "100%" }}
                />
              </>
            )}
            {profilingData.algorithm === "grivas" && (
              <PersonalityTraitsChart
                people={profilingData.people}
                selectedPerson={selectedPerson}
                style={{ width: "38rem", height: "100%" }}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
