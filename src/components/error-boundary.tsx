"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
          <div className="max-w-md w-full space-y-4 text-center">
            <div className="text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold">Algo salio mal</h2>
            <p className="text-muted-foreground">
              Lo sentimos, ha ocurrido un error inesperado.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left mt-4 p-4 bg-muted rounded-lg">
                <summary className="cursor-pointer font-medium">
                  Detalles del error
                </summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
