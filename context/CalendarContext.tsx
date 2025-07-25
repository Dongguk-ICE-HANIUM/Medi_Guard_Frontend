import { useCalendar, useCalendarReturn } from "@/hooks/useCalendar";
import React, { createContext, useContext } from "react";

const CalendarContext = createContext<useCalendarReturn | null>(null);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const today = new Date();
  const calendarData = useCalendar(today);

  React.useEffect(() => {
    if (!calendarData.selectedDate) {
      calendarData.setSelectedDate(today);
    }
  }, []);

  return (
    <CalendarContext.Provider value={calendarData}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendarContext must be used within CalendarProvider");
  }
  return context;
};
