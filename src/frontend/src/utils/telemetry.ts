import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
    config: {
        connectionString: "InstrumentationKey=c842eee3-326e-4195-8709-12a7397eebdd;IngestionEndpoint=https://swedencentral-0.in.applicationinsights.azure.com/;LiveEndpoint=https://swedencentral.livediagnostics.monitor.azure.com/;ApplicationId=1be2f64b-457b-4910-8e3d-3e0b4006f9ac",
        extensions: [reactPlugin],
        enableAutoRouteTracking: true, // Tracks page views automatically
        disableFetchTracking: false, // Tracks fetch requests
    }
});

let initialized = false;

export const initTelemetry = () => {
    if (initialized) return;
    initialized = true;

    appInsights.loadAppInsights();
    appInsights.trackPageView(); // Explicitly track the component load
    console.log("Application Insights initialized");
};

export const trackPageView = (name?: string) => {
    appInsights.trackPageView({ name });
};

export { reactPlugin, appInsights };
