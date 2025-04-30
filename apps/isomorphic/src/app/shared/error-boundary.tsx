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
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, statusCode: undefined };
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
      const message = this.getFriendlyMessage(
        this.state.statusCode,
        this.state.error?.message
      );

      return (
        <div className="flex grow items-center px-6 xl:px-10">
          <div className="mx-auto text-center">
            <Image
              src={PageEaten}
              alt="not found"
              className="mx-auto mb-8 aspect-[360/326] max-w-[256px] xs:max-w-[370px] lg:mb-12 2xl:mb-16"
            />
            <Title
              as="h1"
              className="text-[22px] font-bold leading-normal text-gray-1000 lg:text-3xl"
            >
              {message}
            </Title>
            <Button
              size="xl"
              className="mt-8 h-12 bg-primary px-4 xl:h-14 xl:px-6"
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
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
