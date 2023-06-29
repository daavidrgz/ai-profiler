import Head from "next/head";
import styles from "@/pages/styles/resume.module.scss";
import GenderChart from "@/components/Charts/GenderChart/GenderChart";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import AgeChart from "@/components/Charts/AgeChart/AgeChart";
import PeopleList from "@/components/Charts/PeopleList/PeopleList";
import { useCallback, useEffect, useRef, useState } from "react";
import ProfilingResume from "@/components/Charts/ProfilingResume/ProfilingResume";
import { useData } from "@/components/Providers/DataProvider/DataProvider";
import NavBar from "@/components/UI/NavBar/NavBar";
import FameChart from "@/components/Charts/FameChart/FameChart";
import { data } from "@/utils/mocks";
import { Person } from "@/model/person";

Chart.register(CategoryScale);

export default function ResumePage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const chartsContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTime = 1000;

  const onMouseEnter = useCallback(
    (e: Event) => {
      timeoutRef.current = setTimeout(() => {
        if (!chartsContainerRef.current) return;
        const target = e.target;
        const allElements = chartsContainerRef.current.children;
        Array.from(allElements).forEach((element: Element) => {
          const divElement = element as HTMLDivElement;
          if (divElement !== target) {
            divElement.style.opacity = "1";
          } else {
            divElement.style.boxShadow = "20px 20px 30px rgba(0, 0, 0, 0.461)";
          }
        });
      }, hoverTime);
    },
    [chartsContainerRef]
  );

  const onMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!chartsContainerRef.current) return;
    const allElements = chartsContainerRef.current.children;
    Array.from(allElements).forEach((element: Element) => {
      const divElement = element as HTMLDivElement;
      divElement.style.opacity = "1";
      divElement.style.boxShadow = "5px 5px 20px rgba(0, 0, 0, 0.461)";
    });
  }, [timeoutRef, chartsContainerRef]);

  useEffect(() => {
    if (!chartsContainerRef.current) return;
    const allElements = chartsContainerRef.current.children;
    Array.from(allElements).forEach((element: Element) => {
      element.addEventListener("mouseenter", onMouseEnter);
      element.addEventListener("mouseleave", onMouseLeave);
    });
    return () => {
      Array.from(allElements).forEach((element: Element) => {
        element.removeEventListener("mouseenter", onMouseEnter);
        element.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, [chartsContainerRef, onMouseEnter, onMouseLeave]);

  // const { data } = useData();
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
      <NavBar />
      <main className={styles.main}>
        <h1 className={styles.title}>RESULTS OVERVIEW</h1>

        <div className={styles.chartsContainer} ref={chartsContainerRef}>
          <ProfilingResume profilingData={data} />
          <GenderChart people={data.people} selectedPerson={selectedPerson} />
          <AgeChart people={data.people} selectedPerson={selectedPerson} />
          <PeopleList
            people={data.people}
            selectedPerson={selectedPerson}
            setSelectedPerson={setSelectedPerson}
          />
          {data.algorithm == "martinc" && (
            <>
              <FameChart people={data.people} selectedPerson={selectedPerson} />
            </>
          )}
        </div>
      </main>
    </>
  );
}
