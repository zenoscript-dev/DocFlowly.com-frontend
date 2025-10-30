interface ErrorReport {
  errorId: string;
  type: "unhandled-error" | "unhandled-rejection";
  error: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  additionalInfo?: any;
}

class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  private generateErrorId(): string {
    return `global_error_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  private logError(report: ErrorReport) {
    // In development, log to console
    if (import.meta.env.DEV) {
      console.error("Global Error Handler:", report);
      return;
    }

    // In production, send to error reporting service
    if (import.meta.env.PROD) {
      // Example: Send to your error reporting service
      // this.sendToErrorService(report)

      // For now, log to console in production
      console.error("Production Global Error:", report);
    }
  }

  private handleUnhandledError = (event: ErrorEvent) => {
    const errorReport: ErrorReport = {
      errorId: this.generateErrorId(),
      type: "unhandled-error",
      error: event.message,
      stack: event.error?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      additionalInfo: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    };

    this.logError(errorReport);
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const errorReport: ErrorReport = {
      errorId: this.generateErrorId(),
      type: "unhandled-rejection",
      error: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      additionalInfo: {
        reason: event.reason,
      },
    };

    this.logError(errorReport);
  };

  initialize() {
    if (this.isInitialized) {
      console.warn("GlobalErrorHandler is already initialized");
      return;
    }

    // Handle unhandled JavaScript errors
    window.addEventListener("error", this.handleUnhandledError);

    // Handle unhandled promise rejections
    window.addEventListener(
      "unhandledrejection",
      this.handleUnhandledRejection
    );

    // Handle React errors that bubble up
    if (typeof window !== "undefined") {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        // Check if it's a React error
        const errorMessage = args.join(" ");
        if (
          errorMessage.includes("React") ||
          errorMessage.includes("Warning:")
        ) {
          const errorReport: ErrorReport = {
            errorId: this.generateErrorId(),
            type: "unhandled-error",
            error: errorMessage,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            additionalInfo: {
              args,
            },
          };
          this.logError(errorReport);
        }

        // Call original console.error
        originalConsoleError.apply(console, args);
      };
    }

    this.isInitialized = true;
    console.log("GlobalErrorHandler initialized");
  }

  destroy() {
    if (!this.isInitialized) {
      return;
    }

    window.removeEventListener("error", this.handleUnhandledError);
    window.removeEventListener(
      "unhandledrejection",
      this.handleUnhandledRejection
    );

    this.isInitialized = false;
    console.log("GlobalErrorHandler destroyed");
  }

  // Method to manually report errors
  reportError(error: Error, additionalInfo?: any) {
    const errorReport: ErrorReport = {
      errorId: this.generateErrorId(),
      type: "unhandled-error",
      error: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      additionalInfo,
    };

    this.logError(errorReport);
  }
}

export const globalErrorHandler = GlobalErrorHandler.getInstance();
