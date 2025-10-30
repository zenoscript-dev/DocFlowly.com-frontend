import { Button } from '@/components/ui/button';
import { cn } from '@/core/lib/cn';
import { useCallback, useEffect, useState } from 'react';

const commonTimezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Australia/Sydney',
];

type SelectionMode = 'day' | 'week';

enum DateStatus {
  APPROVED_TIME_ENTRY = 'APPROVED_TIME_ENTRY',
  LESS_HOURS = 'LESS_HOURS',
  MORE_HOURS = 'MORE_HOURS',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isWeekSelected: boolean;
  status: DateStatus;
  weekDay: string;
}

const statusColors: Record<DateStatus, string> = {
  [DateStatus.APPROVED_TIME_ENTRY]: '#D3D3D3',
  [DateStatus.LESS_HOURS]: '#FFE4B5',
  [DateStatus.MORE_HOURS]: '#FFB6C1',
  [DateStatus.SUBMITTED]: '#B0E0E6',
  // [DateStatus.APPROVED_TIME_ENTRY]: '#808080', // Gray
  // [DateStatus.LESS_HOURS]: '#FFA500', // Orange
  // [DateStatus.MORE_HOURS]: '#FF0000', // Red
  // [DateStatus.SUBMITTED]: '#0000FF', // Blue
  // [DateStatus.APPROVED]: '#00FF00',
  // [DateStatus.REJECTED]: '#FF0000',
};

function getNowInTimezone(timezone: string, locale: string) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'numeric', day: 'numeric', timeZone: timezone
  }).formatToParts(now);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1;
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
  return new Date(Date.UTC(year, month, day));
}

function getStartOfCalendarGrid(date: Date, timezone: string, locale: string) {
  const parts = new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'numeric', day: 'numeric', timeZone: timezone
  }).formatToParts(date);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1;
  const firstOfMonth = new Date(Date.UTC(year, month, 1));

  // Get first day of week based on locale
  const firstDayOfWeek = new Intl.DateTimeFormat(locale).resolvedOptions().weekday === 'monday' ? 1 : 0;

  let startOffset = firstOfMonth.getUTCDay() - firstDayOfWeek;
  if (startOffset < 0) startOffset += 7;

  const startDate = new Date(Date.UTC(year, month, 1 - startOffset));
  return startDate;
}

const AppCalender = () => {
  const [selectedTimezone, setSelectedTimezone] = useState('America/Los_Angeles');
  const [locale] = useState('en-GB');
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('day');
  const [currentDate, setCurrentDate] = useState(() => getNowInTimezone('America/Los_Angeles', locale));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedWeekDates, setSelectedWeekDates] = useState<Date[]>([]);
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [calendarWeeks, setCalendarWeeks] = useState<CalendarDay[][]>([]);

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(Date.UTC(2000, i)).toLocaleString(locale, { month: 'long', timeZone: selectedTimezone })
  );
  const years = Array.from({ length: 21 }, (_, i) => {
    const date = new Date();
    const parts = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      timeZone: selectedTimezone
    }).formatToParts(date);
    const currentYear = parseInt(parts.find(p => p.type === 'year')?.value || '0');
    return currentYear - 10 + i;
  });

  // Get days of week based on locale
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.UTC(2021, 0, 3 + i)); // Start with a Sunday
    return date.toLocaleString(locale, { weekday: 'short' });
  });

  // Rotate days array based on locale's first day of week
  const firstDayOfWeek = new Intl.DateTimeFormat(locale).resolvedOptions().weekday === 'monday' ? 1 : 0;
  const rotatedDays = [
    ...daysOfWeek.slice(firstDayOfWeek),
    ...daysOfWeek.slice(0, firstDayOfWeek)
  ];

  const getDateStatus = useCallback((date: Date): DateStatus => {
    const day = date.getUTCDate();
    if (day % 6 === 0) return DateStatus.APPROVED_TIME_ENTRY;
    if (day % 5 === 0) return DateStatus.LESS_HOURS;
    if (day % 4 === 0) return DateStatus.MORE_HOURS;
    if (day % 3 === 0) return DateStatus.SUBMITTED;
    if (day % 2 === 0) return DateStatus.APPROVED;
    return DateStatus.REJECTED;
  }, []);

  const generateCalendarDays = useCallback(() => {
    const startDate = getStartOfCalendarGrid(currentDate, selectedTimezone, locale);
    const weeks: CalendarDay[][] = [];
    const today = getNowInTimezone(selectedTimezone, locale);

    let currentWeek: CalendarDay[] = [];
    for (let i = 0; i < 36; i++) {
      const date = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate() + i));

      const isSelected = selectionMode === 'day' && selectedDate
        ? date.getTime() === selectedDate.getTime()
        : false;

      const isWeekSelected = selectionMode === 'week'
        ? selectedWeekDates.some(d => d.getTime() === date.getTime())
        : false;

      const isToday = date.getTime() === today.getTime();

      currentWeek.push({
        date,
        day: date.getUTCDate(),
        weekDay: rotatedDays[date.getUTCDay()],
        isCurrentMonth: date.getUTCMonth() === currentDate.getUTCMonth(),
        isSelected,
        isToday,
        isWeekSelected,
        status: getDateStatus(date)
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    console.log(weeks, "weeks");
    setCalendarWeeks(weeks);
  }, [currentDate, selectedDate, selectedWeekDates, selectedTimezone, selectionMode, getDateStatus, locale, rotatedDays]);

  // Update current date when timezone changes
  useEffect(() => {
    setCurrentDate(getNowInTimezone(selectedTimezone, locale));
    setSelectedDate(null);
    setSelectedWeekDates([]);
  }, [selectedTimezone, locale]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, selectedDate, selectedWeekDates, selectedTimezone, selectionMode, locale]); // Add all dependencies that generateCalendarDays uses

  const handleDayClick = (date: Date) => {
    if (selectionMode === 'day') {
      setSelectedDate(date);
      setSelectedWeekDates([]);
    } else {
      const firstDayOfWeek = new Intl.DateTimeFormat(locale).resolvedOptions().weekday === 'monday' ? 1 : 0;
      let dayOfWeek = date.getUTCDay() - firstDayOfWeek;
      if (dayOfWeek < 0) dayOfWeek += 7;

      const weekStart = new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() - dayOfWeek
      ));

      const week = Array.from({ length: 7 }, (_, i) => {
        return new Date(Date.UTC(
          weekStart.getUTCFullYear(),
          weekStart.getUTCMonth(),
          weekStart.getUTCDate() + i
        ));
      });
      setSelectedWeekDates(week);
      setSelectedDate(null);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center bg-background font-['Inter',sans-serif] w-full">
        <div className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md">
          {/* Timezone Selector */}
          {/* <div className="mb-4">
            <label htmlFor="timezone-select" className="block text-sm font-medium text-foreground mb-1">
              Select Timezone:
            </label>
            <select
              id="timezone-select"
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring sm:text-sm bg-background text-foreground"
            >
              {commonTimezones.map(tz => (
                <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div> */}

          {/* Selection Mode Selector */}
          {/* <div className="mb-4">
            <label htmlFor="selection-mode" className="block text-sm font-medium text-foreground mb-1">
              Selection Mode:
            </label>
            <select
              id="selection-mode"
              value={selectionMode}
              onChange={(e) => {
                setSelectionMode(e.target.value as SelectionMode);
                setSelectedDate(null);
                setSelectedWeekDates([]);
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring sm:text-sm bg-background text-foreground"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
            </select>
          </div> */}

          <div className="relative">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setCurrentDate(new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 1)))}
                className="p-2 rounded-full bg-primary text-primary-foreground border-none cursor-pointer transition-all duration-200 ease-in-out hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50"
              >
                ‹
              </button>

              <div className="text-2xl font-semibold text-foreground">
                <Button variant="ghost" onClick={() => setShowMonthSelect(!showMonthSelect)}>
                  {currentDate.toLocaleString(locale, { month: 'long', timeZone: selectedTimezone })}
                </Button>{' '}
                <Button variant="ghost" onClick={() => setShowYearSelect(!showYearSelect)}>
                  {currentDate.toLocaleString(locale, { year: 'numeric', timeZone: selectedTimezone })}
                </Button>
              </div>

              <button
                onClick={() => setCurrentDate(new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1)))}
                className="p-2 rounded-full bg-primary text-primary-foreground border-none cursor-pointer transition-all duration-200 ease-in-out hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50"
              >
                ›
              </button>
            </div>

            {showMonthSelect && (
              <div className="absolute top-0 left-0 w-full h-full bg-background z-10 grid grid-cols-3 gap-2 p-4">
                {months.map((month, monthIndex) => (
                  <div
                    key={month}
                    onClick={() => {
                      const parts = new Intl.DateTimeFormat(locale, {
                        year: 'numeric', month: 'numeric', day: 'numeric', timeZone: selectedTimezone
                      }).formatToParts(currentDate);
                      const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
                      const newDate = new Date(Date.UTC(year, monthIndex, 1));
                      setCurrentDate(newDate);
                      setShowMonthSelect(false);
                    }}
                    className="cursor-pointer p-2 text-center hover:bg-accent rounded text-foreground"
                  >
                    {month}
                  </div>
                ))}
              </div>
            )}

            {showYearSelect && (
              <div className="absolute top-0 left-0 w-full h-full bg-background z-10 grid grid-cols-3 gap-2 p-4 overflow-y-auto">
                {years.map(year => (
                  <div
                    key={year}
                    onClick={() => {
                      const parts = new Intl.DateTimeFormat(locale, {
                        year: 'numeric', month: 'numeric', day: 'numeric', timeZone: selectedTimezone
                      }).formatToParts(currentDate);
                      const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1;
                      const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
                      const newDate = new Date(Date.UTC(year, month, day));
                      setCurrentDate(newDate);
                      setShowYearSelect(false);
                    }}
                    className="cursor-pointer p-2 text-center hover:bg-accent rounded text-foreground"
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground mb-4">
              {rotatedDays.map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarWeeks.flat().map((dayObj, index) => (
                <div
                  key={`${dayObj.date.getTime()}-${index}`}
                  onClick={() => handleDayClick(dayObj.date)}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-150 ease-in-out",
                    dayObj.isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                    dayObj.isSelected
                      ? "bg-primary text-primary-foreground shadow-lg border-3 border-primary/70"
                      : dayObj.isWeekSelected
                        ? "bg-primary/20 border-2 border-primary text-primary font-medium"
                        : "hover:bg-accent",
                    dayObj.isToday && !dayObj.isSelected && !dayObj.isWeekSelected
                      ? "border-2 border-primary text-primary font-semibold"
                      : ""
                  )}
                  style={{ backgroundColor: statusColors[dayObj.status] }}
                >
                  {dayObj.day}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      <div className="flex items-center justify-center bg-background py-6  font-['Inter',sans-serif] w-full">
        <div className='bg-card rounded-xl shadow-lg p-6 w-full max-w-md'>
          <h3 className="text-lg font-semibold text-foreground mb-4">Time Entry Status</h3>
          <div className="flex flex-wrap  gap-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: statusColors[DateStatus.APPROVED_TIME_ENTRY] }}
              >
                1
              </div>
              <span className="text-foreground">Approved Time Entry</span>
            </div>
            <div className="flex items-center space-x-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: statusColors[DateStatus.LESS_HOURS] }}
              >
                1
              </div>
              <span className="text-foreground" style={{ color: statusColors[DateStatus.LESS_HOURS] }}>Less Hours</span>
            </div>
            <div className="flex items-center space-x-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: statusColors[DateStatus.MORE_HOURS] }}
              >
                1
              </div>
              <span className="text-foreground" style={{ color: statusColors[DateStatus.MORE_HOURS] }}>More Hours</span>
            </div>
            <div className="flex items-center space-x-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: statusColors[DateStatus.APPROVED] }}
              >
                1
              </div>
              <span className="text-foreground" style={{ color: statusColors[DateStatus.APPROVED] }}>Approved</span>
            </div>
            <div className="flex items-center space-x-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: statusColors[DateStatus.SUBMITTED] }}
              >
                1
              </div>
              <span className="text-foreground" style={{ color: statusColors[DateStatus.SUBMITTED] }}>Submitted</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppCalender;
