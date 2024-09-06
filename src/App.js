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
        this.handlePopState = this.handlePopState.bind(this);
    }

    componentDidMount() {
        window.addEventListener('popstate', this.handlePopState);
        this.handlePopState();
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.handlePopState);
    }

    handlePopState() {
        const validPaths = ['/', '/posts', '/users'];
        const currentPath = window.location.pathname;

        if (!validPaths.includes(currentPath)) {
            this.setState({
                error: `The page at ${currentPath} doesn't exist.`,
                data: null
            });
        } else {
            this.setState({ error: null });
        }
    }

    async handleButtonClick(operationName, endpoint, urlPath) {
        this.setState({ loading: true, error: null, buttonClicked: operationName });

        window.history.pushState({}, '', urlPath);
        this.props.appInsights.startTrackEvent(operationName);

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            this.setState({ data, error: null, loading: false });
            this.props.appInsights.stopTrackEvent(operationName, { status: 'success' });
        } catch (error) {
            this.setState({ data: null, error: error.message, loading: false });
            this.props.appInsights.stopTrackEvent(operationName, { status: 'failure', error: error.message });
        }
    }

    render() {
        const { data, error, loading, buttonClicked } = this.state;

        if (error) {
            return (
                <div className="App" style={styles.container}>
                    <h1 style={styles.errorText}>Error</h1>
                    <p>{error}</p>
                </div>
            );
        }

        return (
            <div className="App" style={styles.container}>
                <h1 style={styles.header}>POC on DataLab Search Performance & Monitoring!</h1>
                <button
                    style={styles.button}
                    onClick={() => this.handleButtonClick('GetProductsOperation', 'https://jsonplaceholder.typicode.com/posts', '/posts')}
                    disabled={loading}
                >
                    {loading && buttonClicked === 'GetProductsOperation' ? 'Loading...' : 'Fetch Posts'}
                </button>
                <button
                    style={styles.button}
                    onClick={() => this.handleButtonClick('GetUsersOperation', 'https://jsonplaceholder.typicode.com/users', '/users')}
                    disabled={loading}
                >
                    {loading && buttonClicked === 'GetUsersOperation' ? 'Loading...' : 'Fetch Users'}
                </button>
                <div>
                    {data && <pre style={styles.data}>{JSON.stringify(data, null, 2)}</pre>}
                </div>
            </div>
        );
    }
}

const styles = {
    container: {
        backgroundColor: '#f5f5f5',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        minHeight: '100vh',
    },
    header: {
        color: '#333',
        fontSize: '2rem',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        margin: '10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    buttonDisabled: {
        backgroundColor: '#888',
    },
    data: {
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '5px',
        marginTop: '20px',
        textAlign: 'left',
    },
    errorText: {
        color: 'red',
    },
};

export default withAITracking(ReactPlugin, App);
