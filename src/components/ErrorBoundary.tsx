import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/core/lib/cn'
import {
  Activity,
  AlertTriangle,
  Bug,
  Copy,
  Home,
  Info,
  RefreshCw,
  Shield,
  X
} from 'lucide-react'
import React from 'react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

// Error types for better categorization
export type ErrorType = 
  | 'network'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'not-found'
  | 'server'
  | 'client'
  | 'unknown'

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

// Error information interface
export interface ErrorInfo {
  type: ErrorType
  severity: ErrorSeverity
  timestamp: Date
  componentStack?: string
  userAgent?: string
  url?: string
  userId?: string
  sessionId?: string
  additionalData?: Record<string, unknown>
}

// Error boundary props interface
export interface ErrorBoundaryProps {
  /** React children to wrap */
  children: React.ReactNode
  /** Custom fallback component */
  fallback?: React.ComponentType<{ error: Error; errorInfo: ErrorInfo; resetError: () => void }>
  /** Whether to show error details in production */
  showErrorDetails?: boolean
  /** Custom error reporting function */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Whether to automatically report errors */
  autoReport?: boolean
  /** Custom error message */
  errorMessage?: string
  /** Whether to show recovery options */
  showRecovery?: boolean
  /** Custom recovery actions */
  recoveryActions?: Array<{
    label: string
    action: () => void
    icon?: React.ComponentType<{ className?: string }>
    variant?: 'default' | 'outline' | 'secondary' | 'destructive'
  }>
  /** Whether to show error ID for support */
  showErrorId?: boolean
  /** Custom className */
  className?: string
  /** Whether to log errors to console */
  logToConsole?: boolean
  /** Custom error categorization function */
  categorizeError?: (error: Error) => { type: ErrorType; severity: ErrorSeverity }
}

// Error boundary state interface
interface ErrorBoundaryState {
  error: Error | null
  errorInfo: ErrorInfo | null
  hasError: boolean
  errorId: string | null
  isReporting: boolean
  isRecovering: boolean
}

// Default error fallback component
const DefaultErrorFallback: React.FC<{
  error: Error
  errorInfo: ErrorInfo
  resetError: () => void
  showErrorDetails?: boolean
  errorMessage?: string
  showRecovery?: boolean
  recoveryActions?: Array<{
    label: string
    action: () => void
    icon?: React.ComponentType<{ className?: string }>
    variant?: 'default' | 'outline' | 'secondary' | 'destructive'
  }>
  showErrorId?: boolean
  errorId?: string
}> = ({ 
  error, 
  errorInfo, 
  resetError, 
  showErrorDetails = false,
  errorMessage,
  showRecovery = true,
  recoveryActions = [],
  showErrorId = true,
  errorId
}) => {
  const [showDetails, setShowDetails] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  // Copy error details to clipboard
  const copyErrorDetails = async () => {
    const errorDetails = `
Error ID: ${errorId}
Error Type: ${errorInfo.type}
Severity: ${errorInfo.severity}
Timestamp: ${errorInfo.timestamp.toISOString()}
URL: ${errorInfo.url}
User Agent: ${errorInfo.userAgent}
Error Message: ${error.message}
Component Stack: ${errorInfo.componentStack}
    `.trim()

    try {
      await navigator.clipboard.writeText(errorDetails)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy error details:', err)
    }
  }

  // Get severity color
  const getSeverityColor = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'low': return 'bg-blue-500'
      case 'medium': return 'bg-yellow-500'
      case 'high': return 'bg-orange-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  // Get error type icon
  const getErrorTypeIcon = (type: ErrorType) => {
    switch (type) {
      case 'network': return <Activity className="h-4 w-4" />
      case 'authentication': return <Shield className="h-4 w-4" />
      case 'authorization': return <Shield className="h-4 w-4" />
      case 'not-found': return <X className="h-4 w-4" />
      case 'server': return <Bug className="h-4 w-4" />
      case 'client': return <Bug className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl font-semibold">
            {errorMessage || 'Something went wrong'}
          </CardTitle>
          <CardDescription>
            We're sorry, but an unexpected error has occurred. Our team has been notified.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getErrorTypeIcon(errorInfo.type)}
              <span className="text-sm font-medium capitalize">
                {errorInfo.type.replace('-', ' ')} Error
              </span>
            </div>
            <Badge 
              variant="secondary" 
              className={cn(getSeverityColor(errorInfo.severity), 'text-white')}
            >
              {errorInfo.severity}
            </Badge>
          </div>

          {/* Error ID */}
          {showErrorId && errorId && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Error Reference</AlertTitle>
              <AlertDescription>
                Error ID: <code className="bg-muted px-1 py-0.5 rounded text-sm">{errorId}</code>
                {showErrorDetails && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyErrorDetails}
                    className="ml-2 h-6 px-2"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Details (Development/Show Details) */}
          {showErrorDetails && (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full"
              >
                {showDetails ? 'Hide' : 'Show'} Error Details
              </Button>
              
              {showDetails && (
                <div className="bg-muted p-4 rounded-lg text-sm font-mono overflow-auto max-h-64">
                  <div className="space-y-2">
                    <div><strong>Error:</strong> {error.message}</div>
                    <div><strong>Stack:</strong></div>
                    <pre className="text-xs whitespace-pre-wrap">{error.stack}</pre>
                    {errorInfo.componentStack && (
                      <>
                        <div><strong>Component Stack:</strong></div>
                        <pre className="text-xs whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recovery Actions */}
          {showRecovery && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">What would you like to do?</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={resetError} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
                {recoveryActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'outline'}
                    onClick={action.action}
                    className="flex-1"
                  >
                    {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Support Information */}
          <div className="text-center text-sm text-muted-foreground">
            <p>If this problem persists, please contact our support team.</p>
            {showErrorId && errorId && (
              <p>Please include the Error ID: <code className="bg-muted px-1 py-0.5 rounded">{errorId}</code></p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Enhanced Error Boundary Class Component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null,
      hasError: false,
      errorId: null,
      isReporting: false,
      isRecovering: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { categorizeError, onError, autoReport = true, logToConsole = true } = this.props

    // Generate error ID
    const errorId = this.generateErrorId()

    // Categorize error
    const categorization = categorizeError ? categorizeError(error) : this.categorizeError(error)

    // Create error info object
    const enhancedErrorInfo: ErrorInfo = {
      type: categorization.type,
      severity: categorization.severity,
      timestamp: new Date(),
      componentStack: errorInfo.componentStack || undefined,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      additionalData: this.getAdditionalData()
    }

    // Log to console if enabled
    if (logToConsole) {
      console.error('Error Boundary caught an error:', {
        error,
        errorInfo: enhancedErrorInfo,
        errorId
      })
    }

    // Update state
    this.setState({
      error,
      errorInfo: enhancedErrorInfo,
      errorId
    })

    // Report error if auto-report is enabled
    if (autoReport) {
      this.reportError(error, enhancedErrorInfo, errorId)
    }

    // Call custom error handler
    if (onError) {
      try {
        onError(error, enhancedErrorInfo)
      } catch (reportingError) {
        console.error('Error in custom error handler:', reportingError)
      }
    }
  }

  // Generate unique error ID
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Categorize error based on error type and message
  private categorizeError(error: Error): { type: ErrorType; severity: ErrorSeverity } {
    const message = error.message.toLowerCase()
    // const name = error.name.toLowerCase()

    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('http')) {
      return { type: 'network', severity: 'medium' }
    }

    // Authentication errors
    if (message.includes('auth') || message.includes('login') || message.includes('token')) {
      return { type: 'authentication', severity: 'high' }
    }

    // Authorization errors
    if (message.includes('permission') || message.includes('access') || message.includes('forbidden')) {
      return { type: 'authorization', severity: 'high' }
    }

    // Not found errors
    if (message.includes('not found') || message.includes('404')) {
      return { type: 'not-found', severity: 'low' }
    }

    // Server errors
    if (message.includes('server') || message.includes('500') || message.includes('internal')) {
      return { type: 'server', severity: 'critical' }
    }

    // Client errors
    if (message.includes('validation') || message.includes('invalid') || message.includes('400')) {
      return { type: 'client', severity: 'medium' }
    }

    // Default categorization
    return { type: 'unknown', severity: 'medium' }
  }

  // Get user ID from various sources
  private getUserId(): string | undefined {
    // Try to get from localStorage, sessionStorage, or other sources
    return localStorage.getItem('userId') || 
           sessionStorage.getItem('userId') || 
           undefined
  }

  // Get session ID
  private getSessionId(): string | undefined {
    return sessionStorage.getItem('sessionId') || 
           localStorage.getItem('sessionId') || 
           undefined
  }

  // Get additional data for error reporting
  private getAdditionalData(): Record<string, unknown> {
    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }

  // Report error to external service
  private async reportError(error: Error, errorInfo: ErrorInfo, errorId: string) {
    this.setState({ isReporting: true })

    try {
      // Example: Report to your error tracking service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ error, errorInfo, errorId })
      // })

      // For now, just log to console
      console.log('Error reported:', { error, errorInfo, errorId })
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    } finally {
      this.setState({ isReporting: false })
    }
  }

  // Reset error state
  private resetError = () => {
    this.setState({
      error: null,
      errorInfo: null,
      hasError: false,
      errorId: null,
      isRecovering: true
    })

    // Small delay to show recovery state
    setTimeout(() => {
      this.setState({ isRecovering: false })
    }, 1000)
  }

  render() {
    const { 
      children, 
      fallback: FallbackComponent,
      showErrorDetails = import.meta.env.DEV,
      errorMessage,
      showRecovery = true,
      recoveryActions = [],
      showErrorId = true,
      className
    } = this.props

    const { error, errorInfo, hasError, errorId, isRecovering } = this.state

    if (hasError && error && errorInfo) {
      // Show recovery state
      if (isRecovering) {
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-md text-center">
              <CardContent className="pt-6">
                <div className="animate-spin mx-auto w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-4"></div>
                <p className="text-muted-foreground">Recovering...</p>
              </CardContent>
            </Card>
          </div>
        )
      }

      // Use custom fallback or default
      if (FallbackComponent) {
        return (
          <FallbackComponent 
            error={error} 
            errorInfo={errorInfo} 
            resetError={this.resetError}
          />
        )
      }

      return (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo}
          resetError={this.resetError}
          showErrorDetails={showErrorDetails}
          errorMessage={errorMessage}
          showRecovery={showRecovery}
          recoveryActions={recoveryActions}
          showErrorId={showErrorId}
          errorId={errorId || undefined}
        />
      )
    }

    return <div className={className}>{children}</div>
  }
}

export default ErrorBoundary
