import NotificationManager from "@/components/notificationManager/NotificationManager";
import "../styles/globals.scss";
import "../styles/builders.scss";
import type { AppProps } from "next/app";
import DataProvider from "@/components/dataProvider/DataProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotificationManager>
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </NotificationManager>
  );
}
