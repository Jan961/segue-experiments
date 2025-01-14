import React from 'react';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError: (error: any, info: any) => void;
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.props.onError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
