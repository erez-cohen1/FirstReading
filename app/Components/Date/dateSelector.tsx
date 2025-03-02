  "use client";
  import { Dispatch, SetStateAction, useEffect, useState } from "react";
  import Calendar from "react-calendar"; // Import react-calendar
  import "react-calendar/dist/Calendar.css"; // Import calendar styles

  export default function DateSelector({
    date,
    setDate,
    topRef,
  }: {
    date: Date;
    setDate: Dispatch<SetStateAction<Date>>;
    topRef: React.RefObject<HTMLDivElement>;
  }) {
    const [showCalendar, setShowCalendar] = useState(false); // State for calendar visibility

    const today = new Date();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dayBeforeYesterday = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const handleCalendarChange = (newDate: Date | Date[]) => {
      if (newDate instanceof Date) {
        setDate(newDate);
      }
      setShowCalendar(false); // Close calendar after selection
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
      <div className="date-selector-wrapper">
        <div className="dates-table-date-selector">
          <div className="date-selector-div">
            <button
              onClick={() => {
                setDate(today);
                setShowCalendar(false);
                topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                console.log("Selected date: היום");
              }}
              className={`date-selector${date.toDateString() === today.toDateString() && !showCalendar ? " selected" : ""}`}
            >
              היום
            </button>
          </div>

          <div className="date-selector-div">
            <button
              onClick={() => {
                setDate(yesterday);
                setShowCalendar(false);
                topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                console.log("Selected date: אתמול");
              }}
              className={`date-selector${date.toDateString() === yesterday.toDateString() && !showCalendar ? " selected" : ""}`}
            >
              אתמול
            </button>
          </div>

          <div className="date-selector-div">
            <button
              onClick={() => {
                setDate(dayBeforeYesterday);
                setShowCalendar(false);
                topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                console.log("Selected date: שלשום");
              }}
              className={`date-selector${date.toDateString() === dayBeforeYesterday.toDateString() && !showCalendar ? " selected" : ""}`}
            >
              שלשום
            </button>
          </div>

          <div className="date-selector-div">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={`date-selector${showCalendar ? " selected" : ""}`}
            >
              אחר
            </button>
          </div>
        </div>

        {/* Show calendar if showCalendar is true */}
        {showCalendar && (
          <div className="calendar-container">
            <Calendar
              onChange={(value) => handleCalendarChange(value as Date)}
              value={date}
              locale="he-IL"
              minDate={new Date(2024, 0, 1)}
              maxDate={new Date(2025, 11, 31)}
            />
          </div>
        )}
      </div>
    );
  }
