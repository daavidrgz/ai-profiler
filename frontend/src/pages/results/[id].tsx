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
import { Profiling } from "@/model/profiling";
import ProfilingService from "@/services/ProfilingService";
import { toProfiling } from "@/model/profilingDto";
import { useNotifications } from "@/components/Providers/NotificationProvider/NotificationProvider";
import plugin from "chartjs-plugin-datalabels";
import { ScreenSize } from "@/utils/mediaqueries";
import { useMediaQuery } from "react-responsive";

Chart.register(CategoryScale);
Chart.register(plugin);

export default function ResumePage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [profiling, setProfiling] = useState<Profiling | null>(null);
  const [fetching, setFetching] = useState(false);

  const router = useRouter();
  const { createErrorNotification } = useNotifications();

  const { id } = router.query;

  useEffect(() => {
    setFetching(true);
    if (id && typeof id === "string") {
      ProfilingService.getProfiling(id)
        .then((profiling) => setProfiling(toProfiling(profiling)))
        .catch((error) => {
          createErrorNotification(error.message, 5000);
        })
        .finally(() => setFetching(false));
    }
  }, [id, createErrorNotification]);

  const isBelowScreenM = useMediaQuery({ maxWidth: ScreenSize.M - 1 });

  if (fetching) return;

  if (!profiling)
    return (
      <>
        <NavBar />
        <div className={styles.noContent}>
          <span className={styles.noContentTitle}>NOTHING TO SHOW</span>
          <span className={styles.noContentDescription}>
            Please, make sure the id is correct or go back and upload a new
            dataset
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
              profiling={profiling}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <div className={styles.secondRow}>
            <PeopleList
              algorithm={profiling.algorithm}
              people={profiling.people}
              selectedPerson={selectedPerson}
              setSelectedPerson={setSelectedPerson}
              style={{
                width: isBelowScreenM ? "100%" : "50%",
                height: isBelowScreenM ? "22rem" : "100%",
              }}
            />
            <AgeChart
              people={profiling.people}
              selectedPerson={selectedPerson}
              style={{
                width: isBelowScreenM ? "100%" : "35%",
                height: isBelowScreenM ? "22rem" : "100%",
              }}
            />
            <GenderChart
              people={profiling.people}
              selectedPerson={selectedPerson}
              style={{
                width: isBelowScreenM ? "100%" : "20%",
                height: isBelowScreenM ? "22rem" : "100%",
              }}
            />
          </div>

          <div className={styles.thirdRow}>
            {profiling.algorithm === "martinc" && (
              <>
                <FameChart
                  direction={isBelowScreenM ? "vertical" : "horizontal"}
                  people={profiling.people}
                  selectedPerson={selectedPerson}
                  style={{
                    width: isBelowScreenM ? "100%" : "25%",
                    height: isBelowScreenM ? "22rem" : "100%",
                  }}
                />
                <OccupationChart
                  direction={isBelowScreenM ? "vertical" : "horizontal"}
                  people={profiling.people}
                  selectedPerson={selectedPerson}
                  style={{
                    width: isBelowScreenM ? "100%" : "45%",
                    height: isBelowScreenM ? "22rem" : "100%",
                  }}
                />
              </>
            )}
            {profiling.algorithm === "grivas" && (
              <PersonalityTraitsChart
                people={profiling.people}
                selectedPerson={selectedPerson}
                style={{
                  width: isBelowScreenM ? "100%" : "35%",
                  height: isBelowScreenM ? "22rem" : "100%",
                }}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
