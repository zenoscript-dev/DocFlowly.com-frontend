import { cn } from "@/core/lib/cn"
import { Clock } from "lucide-react"
import * as React from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
  format?: "12" | "24"
}

export function TimePicker({
  value,
  onChange,
  disabled = false,
  className,
  placeholder = "Select time",
  format = "24"
}: TimePickerProps) {
  const [hours, setHours] = React.useState("")
  const [minutes, setMinutes] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":")
      setHours(h || "")
      setMinutes(m || "")
    } else {
      setHours("")
      setMinutes("")
    }
  }, [value])

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    setHours(newHours)
    setMinutes(newMinutes)
    
    if (newHours && newMinutes) {
      const timeString = `${newHours.padStart(2, "0")}:${newMinutes.padStart(2, "0")}`
      onChange?.(timeString)
    }
  }

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 23)) {
      handleTimeChange(val, minutes)
    }
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
      handleTimeChange(hours, val)
    }
  }

  const formatDisplayTime = () => {
    if (!hours || !minutes) return ""
    
    if (format === "12") {
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? "PM" : "AM"
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      return `${displayHour}:${minutes.padStart(2, "0")} ${ampm}`
    }
    
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? formatDisplayTime() : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex items-center space-x-2">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Hours</label>
            <Input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={handleHourChange}
              placeholder="00"
              className="w-20"
            />
          </div>
          <div className="flex items-center pt-6">
            <span className="text-lg font-semibold">:</span>
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Minutes</label>
            <Input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={handleMinuteChange}
              placeholder="00"
              className="w-20"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => setIsOpen(false)}
            disabled={!hours || !minutes}
          >
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
} 