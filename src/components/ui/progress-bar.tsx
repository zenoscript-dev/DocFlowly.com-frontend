import { cn } from "@/core/lib/cn"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

// Progress bar variants
const progressBarVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      size: {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
        xl: "h-6",
      },
      variant: {
        default: "bg-secondary",
        success: "bg-green-100 dark:bg-green-900/20",
        warning: "bg-yellow-100 dark:bg-yellow-900/20",
        error: "bg-red-100 dark:bg-red-900/20",
        info: "bg-blue-100 dark:bg-blue-900/20",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

// Progress indicator variants
const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        error: "bg-red-500",
        info: "bg-blue-500",
      },
      animated: {
        true: "animate-pulse",
        false: "",
      },
      striped: {
        true: "bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_100%] animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      animated: false,
      striped: false,
    },
  }
)

// Progress bar props interface
export interface ProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressBarVariants> {
  /** Current progress value (0-100) */
  value: number
  /** Maximum progress value (default: 100) */
  max?: number
  /** Whether to show the progress percentage */
  showPercentage?: boolean
  /** Whether to show the progress label */
  showLabel?: boolean
  /** Custom label text */
  label?: string
  /** Whether to animate the progress bar */
  animated?: boolean
  /** Whether to show striped animation */
  striped?: boolean
  /** Custom color for the progress indicator */
  color?: string
  /** Whether the progress bar is indeterminate */
  indeterminate?: boolean
  /** Callback when progress changes */
  onProgressChange?: (value: number) => void
  /** Whether to show a tooltip on hover */
  showTooltip?: boolean
  /** Custom tooltip content */
  tooltipContent?: string
  /** Whether the progress bar is disabled */
  disabled?: boolean
  /** Custom aria-label for accessibility */
  ariaLabel?: string
}

// Progress bar component
export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value,
      max = 100,
      size,
      variant,
      showPercentage = false,
      showLabel = false,
      label,
      animated = false,
      striped = false,
      color,
      indeterminate = false,
      onProgressChange,
      showTooltip = false,
      tooltipContent,
      disabled = false,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    // Validate and clamp progress value
    const clampedValue = React.useMemo(() => {
      if (indeterminate) return 0
      return Math.max(0, Math.min(max, value))
    }, [value, max, indeterminate])

    // Calculate percentage
    const percentage = React.useMemo(() => {
      if (indeterminate) return 0
      return Math.round((clampedValue / max) * 100)
    }, [clampedValue, max, indeterminate])

    // Generate unique ID for accessibility
    const progressId = React.useId()

    // Handle progress change
    const handleProgressChange = React.useCallback(
      (newValue: number) => {
        if (!disabled && onProgressChange) {
          onProgressChange(newValue)
        }
      },
      [disabled, onProgressChange]
    )

    // Custom styles for progress indicator
    const indicatorStyle = React.useMemo(() => {
      const baseStyle: React.CSSProperties = {
        width: indeterminate ? "100%" : `${percentage}%`,
      }

      if (color) {
        baseStyle.backgroundColor = color
      }

      if (indeterminate) {
        baseStyle.animation = "shimmer 2s infinite"
      }

      return baseStyle
    }, [percentage, color, indeterminate])

    // Accessibility attributes
    const accessibilityProps = React.useMemo(() => {
      const props: React.AriaAttributes = {
        role: "progressbar",
        "aria-valuenow": indeterminate ? undefined : clampedValue,
        "aria-valuemin": 0,
        "aria-valuemax": max,
        "aria-label": ariaLabel || label || `Progress: ${percentage}%`,
      }

      if (disabled) {
        props["aria-disabled"] = true
      }

      return props
    }, [clampedValue, max, indeterminate, ariaLabel, label, percentage, disabled])

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...accessibilityProps}
        {...props}
      >
        {/* Label */}
        {(showLabel || label) && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {label || "Progress"}
            </span>
            {showPercentage && !indeterminate && (
              <span className="text-sm text-muted-foreground">
                {percentage}%
              </span>
            )}
          </div>
        )}

        {/* Progress Bar Container */}
        <div
          className={cn(
            progressBarVariants({ size, variant }),
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {/* Progress Indicator */}
          <div
            className={cn(
              progressIndicatorVariants({ variant, animated, striped }),
              indeterminate && "animate-pulse"
            )}
            style={indicatorStyle}
            role="progressbar"
            aria-valuenow={indeterminate ? undefined : clampedValue}
            aria-valuemin={0}
            aria-valuemax={max}
          />

          {/* Tooltip */}
          {showTooltip && !disabled && (
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
              title={tooltipContent || `${percentage}% complete`}
            >
              <div className="bg-foreground text-background px-2 py-1 rounded text-xs font-medium">
                {tooltipContent || `${percentage}%`}
              </div>
            </div>
          )}
        </div>

        {/* Custom styles for indeterminate animation */}
        {indeterminate && (
          <style jsx>{`
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
        )}
      </div>
    )
  }
)

ProgressBar.displayName = "ProgressBar"

// Progress bar group component for multiple progress bars
export interface ProgressBarGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of progress bar items */
  items: Array<{
    id: string
    value: number
    max?: number
    label?: string
    variant?: VariantProps<typeof progressBarVariants>["variant"]
    color?: string
    disabled?: boolean
  }>
  /** Whether to show individual percentages */
  showPercentages?: boolean
  /** Whether to show individual labels */
  showLabels?: boolean
  /** Common size for all progress bars */
  size?: VariantProps<typeof progressBarVariants>["size"]
  /** Whether to animate all progress bars */
  animated?: boolean
  /** Whether to show striped animation on all bars */
  striped?: boolean
}

export const ProgressBarGroup = React.forwardRef<
  HTMLDivElement,
  ProgressBarGroupProps
>(
  (
    {
      className,
      items,
      showPercentages = false,
      showLabels = true,
      size = "md",
      animated = false,
      striped = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-3", className)}
        role="group"
        aria-label="Progress indicators"
        {...props}
      >
        {items.map((item) => (
          <ProgressBar
            key={item.id}
            value={item.value}
            max={item.max}
            label={item.label}
            variant={item.variant}
            color={item.color}
            disabled={item.disabled}
            showPercentage={showPercentages}
            showLabel={showLabels}
            size={size}
            animated={animated}
            striped={striped}
          />
        ))}
      </div>
    )
  }
)

ProgressBarGroup.displayName = "ProgressBarGroup"

// Progress bar with steps component
export interface ProgressStep {
  id: string
  label: string
  status: "pending" | "active" | "completed" | "error"
  value?: number
}

export interface ProgressBarStepsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of progress steps */
  steps: ProgressStep[]
  /** Current active step index */
  currentStep: number
  /** Whether to show step labels */
  showLabels?: boolean
  /** Whether to show step percentages */
  showPercentages?: boolean
  /** Size of the progress bar */
  size?: VariantProps<typeof progressBarVariants>["size"]
  /** Whether to animate transitions */
  animated?: boolean
  /** Callback when step changes */
  onStepChange?: (stepIndex: number) => void
}

export const ProgressBarSteps = React.forwardRef<
  HTMLDivElement,
  ProgressBarStepsProps
>(
  (
    {
      className,
      steps,
      currentStep,
      showLabels = true,
      showPercentages = false,
      size = "md",
      animated = true,
      onStepChange,
      ...props
    },
    ref
  ) => {
    const totalSteps = steps.length
    const progress = ((currentStep + 1) / totalSteps) * 100

    return (
      <div
        ref={ref}
        className={cn("space-y-4", className)}
        role="group"
        aria-label="Progress steps"
        {...props}
      >
        {/* Main progress bar */}
        <ProgressBar
          value={progress}
          max={100}
          size={size}
          animated={animated}
          showPercentage={showPercentages}
          showLabel={false}
          ariaLabel={`Step ${currentStep + 1} of ${totalSteps}`}
        />

        {/* Step indicators */}
        {showLabels && (
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              const isPending = index > currentStep

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center space-y-1"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                      isCompleted && "bg-green-500 text-white",
                      isActive && "bg-blue-500 text-white",
                      isPending && "bg-gray-200 dark:bg-gray-700 text-gray-500"
                    )}
                    role="button"
                    tabIndex={0}
                    onClick={() => onStepChange?.(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        onStepChange?.(index)
                      }
                    }}
                  >
                    {isCompleted ? (
                      "✓"
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs text-center max-w-20 truncate",
                      isActive && "font-medium text-blue-600 dark:text-blue-400",
                      isCompleted && "text-green-600 dark:text-green-400",
                      isPending && "text-gray-500"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)

ProgressBarSteps.displayName = "ProgressBarSteps" 