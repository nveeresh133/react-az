// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React, { useEffect } from 'react';
import { useAppInsightsContext, useTrackMetric } from '@microsoft/applicationinsights-react-js';

function App() {
  const appInsights = useAppInsightsContext();
  const trackPageLoad = useTrackMetric(appInsights, "PageLoadTime");

  useEffect(() => {
    const start = performance.now();
    window.onload = () => {
      const loadTime = performance.now() - start;
      trackPageLoad({ average: loadTime });
    };
  }, [trackPageLoad]);

  return (
    <div className="App">
      <h1>Welcome to the React Application</h1>
    </div>
  );
}

export default App;
