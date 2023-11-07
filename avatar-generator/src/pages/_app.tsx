import "@/styles/globals.css";
import { TriggerProvider } from "@trigger.dev/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TriggerProvider
      publicApiKey={process.env.NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY!}
      apiUrl={process.env.NEXT_PUBLIC_TRIGGER_API_URL}
    >
      <Component {...pageProps} />
    </TriggerProvider>
  );
}
