'use client';
import Image from 'next/image';
import React from 'react';
import { Button } from 'rizzui/button';
import { Title } from 'rizzui/typography';
import PageEaten from '@public/page-eaten.svg';

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  statusCode?: number;
  showDetails?: boolean;
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      statusCode: undefined,
      showDetails: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Try extracting status code if it's an Axios-like error
    let statusCode;
    if (error?.response?.status) {
      statusCode = error.response.status;
    }

    this.setState({ error, statusCode });
  }

  getFriendlyMessage(statusCode?: number, fallback?: string) {
    switch (statusCode) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized Access';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Page Not Found';
      case 500:
        return 'Internal Server Error';
      case 503:
        return 'Service Unavailable';
      default:
        return fallback || 'An unexpected error occurred';
    }
  }

  render() {
    if (this.state.hasError) {
      const message = this.state.statusCode
        ? this.getFriendlyMessage(
            this.state.statusCode,
            this.state.error?.message
          )
        : null;

      return (
        <div className="flex h-full flex-grow items-center justify-center px-6 xl:px-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Image
              src={PageEaten}
              alt="not found"
              className="mx-auto mb-8 aspect-[360/326] max-w-[256px] xs:max-w-[370px] lg:mb-12 2xl:mb-16"
            />
            {message ? (
              <Title
                as="h1"
                className="text-[22px] font-bold leading-normal text-gray-1000 lg:text-3xl"
              >
                {message}
              </Title>
            ) : (
              <>
                <h1 className="text-lg font-semibold text-gray-800 lg:text-2xl">
                  Something went wrong!
                </h1>
                <p className="text-md text-gray-600">
                  Something seriously went wrong somewhere. Check the logs.
                </p>
              </>
            )}
            {this.state.showDetails && (
              <p className="mt-2 text-sm text-red-500">
                {this.state.error?.message}
              </p>
            )}
            <div className="flex w-full max-w-xs justify-between gap-4">
              <Button
                onClick={() =>
                  this.setState({ showDetails: !this.state.showDetails })
                }
                variant="outline"
                size="lg"
              >
                {this.state.showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
              <Button
                size="lg"
                className="bg-primary"
                onClick={() =>
                  this.setState({
                    hasError: false,
                    error: null,
                    statusCode: undefined,
                  })
                }
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
