import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    // You can also log the error to an external service here
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white border rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <pre className="text-sm whitespace-pre-wrap break-words">{this.state.error && this.state.error.toString()}</pre>
            {this.state.info && (
              <details className="mt-2 text-xs text-gray-600">
                <summary>Stack trace</summary>
                <pre className="whitespace-pre-wrap break-words">{this.state.info.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
