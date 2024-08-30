import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            error: null,
            loading: false,
            buttonClicked: '',
        };
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    async handleButtonClick(operationName, endpoint) {
        this.setState({ loading: true, error: null, buttonClicked: operationName });

        // Start tracking the operation
        this.props.appInsights.startTrackEvent(operationName);

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            this.setState({ data, error: null, loading: false });

            // Stop tracking and log successful data fetch
            this.props.appInsights.stopTrackEvent(operationName, { status: 'success' });
        } catch (error) {
            this.setState({ data: null, error: error.message, loading: false });

            // Stop tracking and log failed data fetch
            this.props.appInsights.stopTrackEvent(operationName, { status: 'failure', error: error.message });
        }
    }

    render() {
        const { data, error, loading, buttonClicked } = this.state;

        return (
            <div className="App">
                <h1>Hello, Welcome to the React World!</h1>
                <button onClick={() => this.handleButtonClick('GetProductsOperation', 'https://jsonplaceholder.typicode.com/posts')} disabled={loading}>
                    {loading && buttonClicked === 'GetProductsOperation' ? 'Loading...' : 'Fetch Posts'}
                </button>
                <button onClick={() => this.handleButtonClick('GetUsersOperation', 'https://jsonplaceholder.typicode.com/users')} disabled={loading}>
                    {loading && buttonClicked === 'GetUsersOperation' ? 'Loading...' : 'Fetch Users'}
                </button>
                <div>
                    {error && <p>Error: {error}</p>}
                    {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
                </div>
            </div>
        );
    }
}

export default withAITracking(ReactPlugin, App);
