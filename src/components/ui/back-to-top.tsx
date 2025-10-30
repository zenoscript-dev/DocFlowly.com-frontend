import { Button } from "@/components/ui/button"
import { cn } from "@/core/lib/cn"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronUp } from "lucide-react"
import * as React from "react"

// Back to top button variants
const backToTopVariants = cva(
  "fixed z-50 transition-all duration-300 ease-in-out",
  {
    variants: {
      position: {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "bottom-center": "bottom-6 left-1/2 transform -translate-x-1/2",
        "top-right": "top-6 right-6",
        "top-left": "top-6 left-6",
        "top-center": "top-6 left-1/2 transform -translate-x-1/2",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      variant: {
        default: "",
        floating: "shadow-lg hover:shadow-xl",
        minimal: "opacity-80 hover:opacity-100",
        solid: "bg-background border",
      },
    },
    defaultVariants: {
      position: "bottom-right",
      size: "md",
      variant: "default",
    },
  }
)

// Back to top props interface
export interface BackToTopProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof backToTopVariants> {
  /** Scroll threshold to show the button (in pixels) */
  threshold?: number
  /** Scroll behavior for smooth scrolling */
  smooth?: boolean
  /** Custom scroll target element (defaults to window) */
  target?: HTMLElement | null
  /** Whether to show the button */
  show?: boolean
  /** Custom icon component */
  icon?: React.ComponentType<{ className?: string }>
  /** Custom label for accessibility */
  label?: string
  /** Whether to show a tooltip */
  showTooltip?: boolean
  /** Custom tooltip content */
  tooltipContent?: string
  /** Callback when scroll to top is triggered */
  onScrollToTop?: () => void
  /** Whether the component is disabled */
  disabled?: boolean
  /** Custom scroll duration for smooth scrolling */
  scrollDuration?: number
  /** Whether to show scroll progress indicator */
  showProgress?: boolean
  /** Custom progress color */
  progressColor?: string
  /** Whether to animate the button appearance */
  animate?: boolean
  /** Custom offset from the edge */
  offset?: number
}

// Back to top component
export const BackToTop = React.forwardRef<HTMLDivElement, BackToTopProps>(
  (
    {
      className,
      position = "bottom-right",
      size = "md",
      variant = "default",
      threshold = 400,
      smooth = true,
      target,
      show: controlledShow,
      icon: IconComponent = ChevronUp,
      label = "Back to top",
      showTooltip = false,
      tooltipContent = "Scroll to top",
      onScrollToTop,
      disabled = false,
      scrollDuration = 500,
      showProgress = false,
      progressColor,
      animate = true,
      offset,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const [scrollProgress, setScrollProgress] = React.useState(0)
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    // Determine if button should be shown
    const shouldShow = controlledShow !== undefined ? controlledShow : isVisible

    // Get scroll target
    const scrollTarget = target || window

    // Handle scroll event
    const handleScroll = React.useCallback(() => {
      if (disabled) return

      const scrollTop = scrollTarget === window 
        ? window.pageYOffset || document.documentElement.scrollTop
        : scrollTarget.scrollTop

      const maxScroll = scrollTarget === window
        ? document.documentElement.scrollHeight - window.innerHeight
        : scrollTarget.scrollHeight - scrollTarget.clientHeight

      // Update visibility
      setIsVisible(scrollTop > threshold)

      // Update scroll progress
      if (showProgress && maxScroll > 0) {
        const progress = Math.min((scrollTop / maxScroll) * 100, 100)
        setScrollProgress(progress)
      }
    }, [threshold, disabled, scrollTarget, showProgress])

    // Scroll to top function
    const scrollToTop = React.useCallback(() => {
      if (disabled) return

      const scrollTop = scrollTarget === window 
        ? window.pageYOffset || document.documentElement.scrollTop
        : scrollTarget.scrollTop

      if (scrollTop === 0) return

      if (smooth) {
        const startTime = performance.now()
        const startPosition = scrollTop

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / scrollDuration, 1)
          
          // Easing function (ease-out)
          const easeOut = 1 - Math.pow(1 - progress, 3)
          const newPosition = startPosition * (1 - easeOut)

          if (scrollTarget === window) {
            window.scrollTo(0, newPosition)
          } else {
            scrollTarget.scrollTop = newPosition
          }

          if (progress < 1) {
            requestAnimationFrame(animateScroll)
          }
        }

        requestAnimationFrame(animateScroll)
      } else {
        if (scrollTarget === window) {
          window.scrollTo(0, 0)
        } else {
          scrollTarget.scrollTop = 0
        }
      }

      onScrollToTop?.()
    }, [smooth, scrollDuration, scrollTarget, disabled, onScrollToTop])

    // Add scroll event listener
    React.useEffect(() => {
      if (disabled) return

      const element = scrollTarget === window ? window : scrollTarget
      element.addEventListener("scroll", handleScroll, { passive: true })
      
      // Initial check
      handleScroll()

      return () => {
        element.removeEventListener("scroll", handleScroll)
      }
    }, [handleScroll, scrollTarget, disabled])

    // Handle keyboard navigation
    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        scrollToTop()
      }
    }, [scrollToTop])

    // Get button size classes
    const getButtonSize = () => {
      switch (size) {
        case "sm":
          return "h-8 w-8"
        case "lg":
          return "h-12 w-12"
        default:
          return "h-10 w-10"
      }
    }

    // Get position with custom offset
    const getPositionStyle = (): React.CSSProperties => {
      const baseStyle: React.CSSProperties = {}
      
      if (offset !== undefined) {
        switch (position) {
          case "bottom-right":
            baseStyle.bottom = `${offset}px`
            baseStyle.right = `${offset}px`
            break
          case "bottom-left":
            baseStyle.bottom = `${offset}px`
            baseStyle.left = `${offset}px`
            break
          case "bottom-center":
            baseStyle.bottom = `${offset}px`
            baseStyle.left = "50%"
            baseStyle.transform = "translateX(-50%)"
            break
          case "top-right":
            baseStyle.top = `${offset}px`
            baseStyle.right = `${offset}px`
            break
          case "top-left":
            baseStyle.top = `${offset}px`
            baseStyle.left = `${offset}px`
            break
          case "top-center":
            baseStyle.top = `${offset}px`
            baseStyle.left = "50%"
            baseStyle.transform = "translateX(-50%)"
            break
        }
      }

      return baseStyle
    }

    // Accessibility attributes
    const accessibilityProps = {
      role: "button",
      tabIndex: disabled ? -1 : 0,
      "aria-label": label,
      "aria-disabled": disabled,
      "aria-hidden": !shouldShow,
    }

    return (
      <div
        ref={ref}
        className={cn(
          backToTopVariants({ position, size, variant }),
          animate && "transition-all duration-300 ease-in-out",
          shouldShow 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-2 pointer-events-none",
          className
        )}
        style={getPositionStyle()}
        {...accessibilityProps}
        {...props}
      >
        <Button
          ref={buttonRef}
          variant="secondary"
          size="icon"
          className={cn(
            getButtonSize(),
            "relative overflow-hidden",
            variant === "floating" && "shadow-lg hover:shadow-xl",
            variant === "minimal" && "opacity-80 hover:opacity-100",
            variant === "solid" && "bg-background border",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={scrollToTop}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          title={showTooltip ? tooltipContent : undefined}
        >
          {/* Progress indicator */}
          {showProgress && scrollProgress > 0 && (
            <div
              className="absolute inset-0 bg-current opacity-20"
              style={{
                clipPath: `polygon(0 ${100 - scrollProgress}%, 100% ${100 - scrollProgress}%, 100% 100%, 0 100%)`,
                color: progressColor,
              }}
            />
          )}

          {/* Icon */}
          <IconComponent 
            className={cn(
              "h-4 w-4",
              size === "sm" && "h-3 w-3",
              size === "lg" && "h-6 w-6"
            )} 
          />
        </Button>
      </div>
    )
  }
)

BackToTop.displayName = "BackToTop" 