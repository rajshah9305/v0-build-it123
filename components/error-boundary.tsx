// Enhanced Error Boundary System
// Location: /components/error-boundary.tsx

'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, RefreshCw, Bug, Mail } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  level?: 'page' | 'component' | 'tool'
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
  retryCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3
  private retryTimeout: NodeJS.Timeout | null = null

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: '',
    retryCount: 0
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    
    return {
      hasError: true,
      error,
      errorId,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props

    // Enhanced error logging with context
    this.logError(error, errorInfo, level)

    this.setState({
      error,
      errorInfo,
    })

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo)
    }

    // Report to monitoring service (in production)
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo, level)
    }
  }

  private logError = (error: Error, errorInfo: ErrorInfo, level: string) => {
    console.group(`🚨 Error Boundary Triggered [${level.toUpperCase()}]`)
    console.error('Error:', error)
    console.error('Component Stack:', errorInfo.componentStack)
    console.error('Error Boundary State:', this.state)
    console.groupEnd()
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo, level: string) => {
    try {
      // In production, integrate with services like Sentry, LogRocket, etc.
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        level,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }

      // Example: Send to monitoring service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // })

      console.info('Error reported to monitoring service', errorReport)
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  private handleRetry = () => {
    if (this.state.retryCount >= this.maxRetries) {
      return
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }))

    // Auto-retry with exponential backoff
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
    
    this.retryTimeout = setTimeout(() => {
      // Force re-render after short delay
      this.forceUpdate()
    }, Math.pow(2, this.state.retryCount) * 1000)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private copyErrorDetails = async () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      // Could show a toast here
      console.info('Error details copied to clipboard')
    } catch (err) {
      console.error('Failed to copy error details:', err)
    }
  }

  public componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
  }

  public render() {
    const { hasError, error, errorId, retryCount } = this.state
    const { children, fallback, level = 'component' } = this.props

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback
      }

      // Determine error severity and UI
      const isToolError = level === 'tool'
      const isPageError = level === 'page'
      const canRetry = retryCount < this.maxRetries

      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">
                  {isPageError ? 'Application Error' : isToolError ? 'Tool Error' : 'Component Error'}
                </CardTitle>
                <Badge variant="outline" className="ml-auto text-xs">
                  ID: {errorId.split('_').pop()}
                </Badge>
              </div>
              <CardDescription>
                {isToolError && 'A tool encountered an unexpected error and stopped working.'}
                {isPageError && 'The application encountered an unexpected error.'}
                {!isToolError && !isPageError && 'A component encountered an unexpected error.'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Error Details */}
              <div className="bg-muted rounded-md p-3">
                <p className="font-mono text-sm text-destructive mb-2">
                  {error.message || 'Unknown error occurred'}
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <details className="text-xs text-muted-foreground">
                    <summary className="cursor-pointer hover:text-foreground">
                      Stack Trace (Development)
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {canRetry && (
                  <Button onClick={this.handleRetry} variant="default" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry {retryCount > 0 && `(${retryCount}/${this.maxRetries})`}
                  </Button>
                )}
                
                {isPageError && (
                  <Button onClick={this.handleReload} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload Page
                  </Button>
                )}

                <Button onClick={this.copyErrorDetails} variant="outline" size="sm">
                  <Bug className="h-4 w-4 mr-2" />
                  Copy Error Details
                </Button>

                <Button 
                  onClick={() => window.open('mailto:support@nexusai.app?subject=Error Report')} 
                  variant="ghost" 
                  size="sm"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </div>

              {/* Retry Exhausted Message */}
              {!canRetry && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  <p className="text-sm text-destructive">
                    Maximum retry attempts reached. Please reload the page or contact support.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return children
  }
}

// Specialized error boundaries for different contexts
export const ToolErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="tool" fallback={
    <div className="flex items-center justify-center p-8 border border-dashed border-muted-foreground/25 rounded-md">
      <div className="text-center space-y-2">
        <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground">Tool temporarily unavailable</p>
      </div>
    </div>
  }>
    {children}
  </ErrorBoundary>
)

export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="page">
    {children}
  </ErrorBoundary>
)

// Hook for programmatic error handling
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, context?: string) => {
    console.error(`Handled error${context ? ` in ${context}` : ''}:`, error)
    
    // In production, report to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Report error
      console.info('Error reported to monitoring service')
    }
  }, [])

  return handleError
}

// Async error boundary hook
export const useAsyncError = () => {
  const [, setError] = React.useState()
  
  return React.useCallback((error: Error) => {
    setError(() => {
      throw error
    })
  }, [setError])
}
