// src/App.js
import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

// Define the App component
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
            loading: false,
        };
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    async handleButtonClick() {
        this.setState({ loading: true, error: null });

        // Track the button click event
        this.props.appInsights.trackEvent({ name: 'ButtonClick', properties: { action: 'FetchData' } });

        try {
            // Simulate data fetching
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay
            const simulatedData = { message: 'Simulated data fetched successfully!' };

            this.setState({ data: simulatedData, error: null, loading: false });

            // Track successful data fetch
            this.props.appInsights.trackEvent({ name: 'DataFetchSuccess', properties: { status: 'success' } });
        } catch (error) {
            this.setState({ data: null, error: error.message, loading: false });

            // Track failed data fetch
            this.props.appInsights.trackEvent({ name: 'DataFetchFailure', properties: { status: 'failure', error: error.message } });
        }
    }

    render() {
        const { data, error, loading } = this.state;

        return (
            <div className="App">
                <h1>Hello,  Welcome to the React World!</h1>
                <button onClick={this.handleButtonClick} disabled={loading}>
                    {loading ? 'Loading...' : 'Get Data'}
                </button>
                <div>
                    {error && <p>Error: {error}</p>}
                    {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
                </div>
                {/* Your app components */}
            </div>
        );
    }
}

// Export the App component with AI tracking
export default withAITracking(ReactPlugin, App);