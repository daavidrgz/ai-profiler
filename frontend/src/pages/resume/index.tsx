import Head from "next/head";
import styles from "@/pages/styles/resume.module.scss";
import GenderChart from "@/components/genderChart/GenderChart";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import AgeChart from "@/components/ageChart/AgeChart";
import PeopleList from "@/components/peopleList/PeopleList";
import { useEffect, useRef } from "react";
import ProfilingResume from "@/components/profilingResume/ProfilingResume";
import { useData } from "@/components/dataProvider/DataProvider";
import { toProfilingData } from "@/model/profilingDataDto";

Chart.register(CategoryScale);

export default function ResumePage() {
  const chartsContainerRef = useRef<HTMLDivElement>(null);

  let timeout: NodeJS.Timeout | null = null;
  const onMouseEnter = (e: Event) => {
    timeout = setTimeout(() => {
      if (!chartsContainerRef.current) return;
      const target = e.target;
      const allElements = chartsContainerRef.current.children;
      Array.from(allElements).forEach((element: Element) => {
        const divElement = element as HTMLDivElement;
        if (divElement !== target) {
          divElement.style.opacity = "0.6";
        } else {
          divElement.style.boxShadow = "20px 20px 30px rgba(0, 0, 0, 0.461)";
        }
      });
    }, 1000);
  };

  const onMouseLeave = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    if (!chartsContainerRef.current) return;
    const allElements = chartsContainerRef.current.children;
    Array.from(allElements).forEach((element: Element) => {
      const divElement = element as HTMLDivElement;
      divElement.style.opacity = "1";
      divElement.style.boxShadow = "5px 5px 20px rgba(0, 0, 0, 0.461)";
    });
  };

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
  }, [chartsContainerRef]);

  const { data } = useData();
  if (!data) return <div>Loading...</div>;

  // const data = toProfilingData({
  //   status: "success",
  //   profiling: {
  //     algorithm: "martinc_celebrity",
  //     time: 4810,
  //     output: [
  //       {
  //         id: 18506,
  //         result: {
  //           gender: "male",
  //           fame: "rising",
  //           occupation: "performer",
  //           birthyear: "1990s",
  //         },
  //       },
  //       {
  //         id: 29502,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "sports",
  //           birthyear: "1980s",
  //         },
  //       },
  //       {
  //         id: 38991,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "sports",
  //           birthyear: "1960s",
  //         },
  //       },
  //       {
  //         id: 3106,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "performer",
  //           birthyear: "1970s",
  //         },
  //       },
  //       {
  //         id: 12766,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "performer",
  //           birthyear: "1960s",
  //         },
  //       },
  //       {
  //         id: 22313,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "politics",
  //           birthyear: "1950s",
  //         },
  //       },
  //       {
  //         id: 39097,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "performer",
  //           birthyear: "1980s",
  //         },
  //       },
  //       {
  //         id: 6476,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "creator",
  //           birthyear: "1960s",
  //         },
  //       },
  //       {
  //         id: 40241,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "creator",
  //           birthyear: "1950s",
  //         },
  //       },
  //       {
  //         id: 39296,
  //         result: {
  //           gender: "female",
  //           fame: "star",
  //           occupation: "performer",
  //           birthyear: "1980s",
  //         },
  //       },
  //       {
  //         id: 4425,
  //         result: {
  //           gender: "male",
  //           fame: "superstar",
  //           occupation: "sports",
  //           birthyear: "1990s",
  //         },
  //       },
  //       {
  //         id: 12080,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "creator",
  //           birthyear: "1960s",
  //         },
  //       },
  //       {
  //         id: 13626,
  //         result: {
  //           gender: "female",
  //           fame: "star",
  //           occupation: "sports",
  //           birthyear: "1980s",
  //         },
  //       },
  //       {
  //         id: 19033,
  //         result: {
  //           gender: "female",
  //           fame: "star",
  //           occupation: "performer",
  //           birthyear: "1980s",
  //         },
  //       },
  //       {
  //         id: 35810,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "politics",
  //           birthyear: "1960s",
  //         },
  //       },
  //       {
  //         id: 41233,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "sports",
  //           birthyear: "1960s",
  //         },
  //       },
  //       {
  //         id: 4189,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "sports",
  //           birthyear: "1970s",
  //         },
  //       },
  //       {
  //         id: 35492,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "sports",
  //           birthyear: "1970s",
  //         },
  //       },
  //       {
  //         id: 21546,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "sports",
  //           birthyear: "1980s",
  //         },
  //       },
  //       {
  //         id: 47432,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "sports",
  //           birthyear: "1960s",
  //         },
  //       },
  //       {
  //         id: 24690,
  //         result: {
  //           gender: "male",
  //           fame: "star",
  //           occupation: "performer",
  //           birthyear: "1970s",
  //         },
  //       },
  //       {
  //         id: 31466,
  //         result: {
  //           gender: "female",
  //           fame: "star",
  //           occupation: "performer",
  //           birthyear: "1990s",
  //         },
  //       },
  //       {
  //         id: 37063,
  //         result: {
  //           gender: "female",
  //           fame: "star",
  //           occupation: "sports",
  //           birthyear: "1990s",
  //         },
  //       },
  //     ],
  //   },
  // });

  return (
    <>
      <Head>
        <title>AIProfiler</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>RESULTS OVERVIEW</h1>

        <div className={styles.chartsContainer} ref={chartsContainerRef}>
          <ProfilingResume profilingData={data} />
          <GenderChart people={data.people} />
          <AgeChart people={data.people} />
          <PeopleList people={data.people} />
        </div>
      </main>
    </>
  );
}
