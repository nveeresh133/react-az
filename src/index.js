// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';

// Create browser history
const browserHistory = createBrowserHistory({ basename: '' });

// Initialize React Plugin
const reactPlugin = new ReactPlugin();

// Initialize Application Insights
const appInsights = new ApplicationInsights({
  config: {
    connectionString: 'InstrumentationKey=63f4ae2d-d364-448f-9bbc-842f18e40c24;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/;ApplicationId=2c935603-2d5f-4911-972b-5f92f01fcfc3', // Replace with your actual connection string
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history: browserHistory },
    },
    enableAutoRouteTracking: true, // Enables automatic route tracking
  },
});

// Load Application Insights
appInsights.loadAppInsights();

// Render the application
ReactDOM.render(
  <React.StrictMode>
    <App appInsights={appInsights} /> {/* Pass appInsights as a prop */}
  </React.StrictMode>,
  document.getElementById('root')
);