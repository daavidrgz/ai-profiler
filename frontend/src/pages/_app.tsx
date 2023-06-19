import NotificationManager from "@/components/notificationManager/NotificationManager";
import "../styles/globals.scss";
import "../styles/builders.scss";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotificationManager>
      <Component {...pageProps} />
    </NotificationManager>
  );
}
