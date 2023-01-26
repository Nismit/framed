import { render } from "preact";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { App } from "./app";
import "./index.css";

Sentry.init({
  dsn: "https://55fa480348a2466594b5e449851d5bc3@o4504569208897536.ingest.sentry.io/4504569215385600",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

render(<App />, document.getElementById("app")!);
