import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";

interface OverflowTooltipProps {
  text: string;
  className?: string;
  maxWidth?: number;
  lineClamp?: number;
  showMoreWhenOverflow?: boolean;
  showMoreLabel?: string;
}

export const OverflowTooltip = ({
  text,
  className = "",
  maxWidth,
  lineClamp,
  showMoreWhenOverflow = false,
  showMoreLabel = "Show more",
}: OverflowTooltipProps) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const checkOverflow = () => {
      if (!element) return;

      if (lineClamp) {
        // using line clamp → compare scrollHeight with rendered height
        const lineHeight = parseFloat(
          window.getComputedStyle(element).lineHeight || "0"
        );
        const maxHeight = lineHeight * lineClamp;
        setIsOverflowing(element.scrollHeight > maxHeight + 1); // +1 tolerance
      } else {
        // Width-based truncation
        setIsOverflowing(element.scrollWidth > element.clientWidth);
      }
    };

    // Use ResizeObserver instead of window resize
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);

    // Initial check
    checkOverflow();

    return () => {
      observer.disconnect();
    };
  }, [text, lineClamp]);

  if (!text) {
    return <span className={className}>{text}</span>;
  }

  const lineClampClass = lineClamp ? `line-clamp-${lineClamp}` : "truncate";

  const content = (
    <div
      ref={containerRef}
      className={`${lineClampClass} ${className}`}
      style={maxWidth ? { maxWidth: `${maxWidth}px` } : {}}
    >
      {text}
    </div>
  );

  if (showMoreWhenOverflow) {
    return (
      <TooltipProvider>
        <div className="relative">
          {content}
          {isOverflowing && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-[var(--color-chart-1)] hover:underline text-xs font-medium mt-1">
                  {showMoreLabel}
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs border bg-white p-2 text-gray-900 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                <p className="text-sm break-words">{text}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        {isOverflowing && (
          <TooltipContent className="max-w-xs border bg-white p-2 text-gray-900 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
            <p className="text-sm break-words">{text}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
