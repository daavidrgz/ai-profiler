import NotificationManager from "@/components/Providers/NotificationProvider/NotificationProvider";
import "../styles/globals.scss";
import "../styles/builders.scss";
import "../styles/prism.css";
import type { AppProps } from "next/app";
import { montserrat } from "@/utils/fonts";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={montserrat.className}>
      <NotificationManager>
        <Component {...pageProps} />
      </NotificationManager>
    </main>
  );
}
