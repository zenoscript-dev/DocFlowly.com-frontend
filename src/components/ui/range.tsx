import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/core/lib/cn"
import { Input } from "./input"
import { Label } from "./label"

export interface ExperienceRangeProps {
  value?: [number, number]
  onValueChange?: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  label?: string
  minLabel?: string
  maxLabel?: string
  unit?: string
  showInputs?: boolean
  debounceDelay?: number
  required?: boolean
}

const ExperienceRange = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  ExperienceRangeProps
>(({ 
  value = [0, 10], 
  onValueChange, 
  min = 0, 
  max = 20, 
  step = 1, 
  disabled = false,
  className,
  label = "Experience Range",
  minLabel = "Min",
  maxLabel = "Max",
  unit = "years",
  showInputs = true,
  debounceDelay = 300,
  required = false,
  ...props 
}, ref) => {
  const [localValue, setLocalValue] = React.useState<[number, number]>(value)
  const [minInput, setMinInput] = React.useState(value[0].toString())
  const [maxInput, setMaxInput] = React.useState(value[1].toString())
  const [errors, setErrors] = React.useState<{ min?: string; max?: string }>({})

  // Debounced callback for API calls
  const debouncedOnValueChange = React.useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return (newValue: [number, number]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        onValueChange?.(newValue)
      }, debounceDelay)
    }
  }, [onValueChange, debounceDelay])

  // Update local state when prop value changes
  React.useEffect(() => {
    setLocalValue(value)
    setMinInput(value[0].toString())
    setMaxInput(value[1].toString())
  }, [value])

  const validateInput = (val: number, type: 'min' | 'max'): string | undefined => {
    if (val < min) return `Value must be at least ${min}`
    if (val > max) return `Value must be at most ${max}`
    if (type === 'min' && val >= localValue[1]) return 'Min value must be less than max value'
    if (type === 'max' && val <= localValue[0]) return 'Max value must be greater than min value'
    return undefined
  }

  const handleSliderChange = (newValue: number[]) => {
    const [newMin, newMax] = newValue as [number, number]
    setLocalValue([newMin, newMax])
    setMinInput(newMin.toString())
    setMaxInput(newMax.toString())
    setErrors({})
    debouncedOnValueChange([newMin, newMax])
  }

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setMinInput(inputValue)
    
    if (inputValue === '') {
      setErrors(prev => ({ ...prev, min: undefined }))
      return
    }

    const numValue = parseFloat(inputValue)
    if (isNaN(numValue)) {
      setErrors(prev => ({ ...prev, min: 'Please enter a valid number' }))
      return
    }

    const error = validateInput(numValue, 'min')
    if (error) {
      setErrors(prev => ({ ...prev, min: error }))
      return
    }

    setErrors(prev => ({ ...prev, min: undefined }))
    const newValue: [number, number] = [numValue, localValue[1]]
    setLocalValue(newValue)
    debouncedOnValueChange(newValue)
  }

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setMaxInput(inputValue)
    
    if (inputValue === '') {
      setErrors(prev => ({ ...prev, max: undefined }))
      return
    }

    const numValue = parseFloat(inputValue)
    if (isNaN(numValue)) {
      setErrors(prev => ({ ...prev, max: 'Please enter a valid number' }))
      return
    }

    const error = validateInput(numValue, 'max')
    if (error) {
      setErrors(prev => ({ ...prev, max: error }))
      return
    }

    setErrors(prev => ({ ...prev, max: undefined }))
    const newValue: [number, number] = [localValue[0], numValue]
    setLocalValue(newValue)
    debouncedOnValueChange(newValue)
  }

  const handleMinInputBlur = () => {
    if (minInput === '' || errors.min) {
      setMinInput(localValue[0].toString())
      setErrors(prev => ({ ...prev, min: undefined }))
    }
  }

  const handleMaxInputBlur = () => {
    if (maxInput === '' || errors.max) {
      setMaxInput(localValue[1].toString())
      setErrors(prev => ({ ...prev, max: undefined }))
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <Label className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      <div className="space-y-3">
        {/* Range Slider */}
        <SliderPrimitive.Root
          ref={ref}
          value={localValue}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb 
            className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover:scale-110" 
          />
          <SliderPrimitive.Thumb 
            className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover:scale-110" 
          />
        </SliderPrimitive.Root>

        {/* Input Fields */}
        {showInputs && (
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-1">
              <Label htmlFor="min-experience" className="text-xs text-muted-foreground">
                {minLabel}
              </Label>
              <div className="relative">
                <Input
                  id="min-experience"
                  type="number"
                  value={minInput}
                  onChange={handleMinInputChange}
                  onBlur={handleMinInputBlur}
                  min={min}
                  max={max}
                  step={step}
                  disabled={disabled}
                  className={cn(
                    "pr-8",
                    errors.min && "border-destructive focus-visible:ring-destructive"
                  )}
                  placeholder={`${min}`}
                />
                {unit && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    {unit}
                  </span>
                )}
              </div>
              {errors.min && (
                <p className="text-xs text-destructive">{errors.min}</p>
              )}
            </div>

            <div className="flex items-end pb-2">
              <span className="text-sm text-muted-foreground">to</span>
            </div>

            <div className="flex-1 space-y-1">
              <Label htmlFor="max-experience" className="text-xs text-muted-foreground">
                {maxLabel}
              </Label>
              <div className="relative">
                <Input
                  id="max-experience"
                  type="number"
                  value={maxInput}
                  onChange={handleMaxInputChange}
                  onBlur={handleMaxInputBlur}
                  min={min}
                  max={max}
                  step={step}
                  disabled={disabled}
                  className={cn(
                    "pr-8",
                    errors.max && "border-destructive focus-visible:ring-destructive"
                  )}
                  placeholder={`${max}`}
                />
                {unit && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    {unit}
                  </span>
                )}
              </div>
              {errors.max && (
                <p className="text-xs text-destructive">{errors.max}</p>
              )}
            </div>
          </div>
        )}

        {/* Current Values Display */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{localValue[0]} {unit}</span>
          <span>{localValue[1]} {unit}</span>
        </div>
      </div>
    </div>
  )
})

ExperienceRange.displayName = "ExperienceRange"

export { ExperienceRange }
