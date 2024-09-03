import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';
import App from './App';  // Import the App component

const browserHistory = createBrowserHistory({ basename: '' });

const reactPlugin = new ReactPlugin();

const clickPluginInstance = new ClickAnalyticsPlugin();
const clickPluginConfig = {
    autoCapture: true,
};

const appInsights = new ApplicationInsights({
    config: {
        connectionString: 'InstrumentationKey=63f4ae2d-d364-448f-9bbc-842f18e40c24;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/;ApplicationId=2c935603-2d5f-4911-972b-5f92f01fcfc3', // Replace with your actual connection string
        extensions: [reactPlugin, clickPluginInstance],
        extensionConfig: {
            [reactPlugin.identifier]: { history: browserHistory },
            [clickPluginInstance.identifier]: clickPluginConfig,
        },
    },
});

appInsights.loadAppInsights();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App appInsights={appInsights} />
    </React.StrictMode>
);
