import NotificationManager from "@/components/Providers/NotificationProvider/NotificationProvider";
import "../styles/globals.scss";
import "../styles/builders.scss";
import "../styles/prism.css";
import type { AppProps } from "next/app";
import DataProvider from "@/components/Providers/DataProvider/DataProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotificationManager>
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </NotificationManager>
  );
}
