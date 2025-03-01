"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRef } from "react";
import WheelDatePicker from "./WheelDatePicker";
import Calendar from "react-calendar"; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import calendar styles

export default function DateSelector({
  root,
  date,
  setDate,
  topRef,
}: {
  root: Element | null;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  topRef: React.RefObject<HTMLDivElement>;
}) {
  const [showWheels, setShowWeels] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false); // New state for calendar toggle

  useEffect(() => {
    if (showWheels) {
      document.documentElement.style.setProperty("--main-title-height-small", "9rem");
    } else {
      document.documentElement.style.setProperty("--main-title-height-small", "2rem");
    }
  }, [showWheels]);

  const today = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); // Subtract 1 day in milliseconds
  const dayBeforeYesterday = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Subtract 2 days in milliseconds

  // Update handleCalendarChange to subtract 1 day from the selected date
  const handleCalendarChange = (newDate: Date | Date[]) => {
    if (newDate instanceof Date) {
      const adjustedDate = new Date(newDate); // Create a new Date instance to avoid mutation
      adjustedDate.setDate(adjustedDate.getDate()); 
      setDate(adjustedDate); // Set the adjusted date
      console.log("Selected date:", adjustedDate); // Log the selected date
    }
    setShowCalendar(false); // Close the calendar after selecting a date
    setShowWeels(false); // Close the wheel date picker if open
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="date-selector-wrapper">
      <div className="dates-table-date-selector">
        <div className="date-selector-div">
          <button
            onClick={() => {
              setDate(today);
              setShowWeels(false);
              setShowCalendar(false);
              topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              console.log("Selected date: היום"); // Log the selected date
            }}
            className={`date-selector${date.toDateString() == today.toDateString() && !showWheels && !showCalendar ? " selected" : ""}`}
          >
            היום
          </button>
        </div>
        <div
          className={`date-vertical-line${
            date.toDateString() == today.toDateString() || (date.toDateString() == yesterday.toDateString() && !showWheels && !showCalendar)
              ? " line-selected"
              : ""
          }`}></div>
        <div className="date-selector-div">
          <button
            onClick={() => {
              setDate(yesterday);
              setShowWeels(false);
              setShowCalendar(false);
              topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              console.log("Selected date: אתמול"); // Log the selected date
            }}
            className={`date-selector${date.toDateString() == yesterday.toDateString() && !showWheels && !showCalendar ? " selected" : ""}`}
          >
            אתמול
          </button>
        </div>
        <div
          className={`date-vertical-line${
            date.toDateString() == yesterday.toDateString() ||
            (date.toDateString() == dayBeforeYesterday.toDateString() && !showWheels && !showCalendar)
              ? " line-selected"
              : ""
          }`}></div>
        <div className="date-selector-div">
          <button
            onClick={() => {
              setDate(dayBeforeYesterday);
              setShowWeels(false);
              setShowCalendar(false);
              topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              console.log("Selected date: שלשום"); // Log the selected date
            }}
            className={`date-selector${
              date.toDateString() == dayBeforeYesterday.toDateString() && !showWheels && !showCalendar ? " selected" : ""
            }`}
          >
            שלשום
          </button>
        </div>
        <div
          className={`date-vertical-line${
            date.toDateString() == dayBeforeYesterday.toDateString() || showWheels || showCalendar ? " line-selected" : ""
          }`}></div>
        <div className="date-selector-div">
          <button
            onClick={() => {
              setShowCalendar(!showCalendar); // Toggle calendar visibility
              setShowWeels(false); // Hide wheel picker
            }}
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
            onChange={(value) => handleCalendarChange(value as Date)} // Handle date change from calendar
            value={date} // Set the initial value of the calendar
            locale="he-IL" // Set locale to Hebrew
            minDate={new Date(2024, 0, 1)} // Min date set to Jan 1, 2024
            maxDate={new Date(2025, 11, 31)} // Max date set to Dec 31, 2025
          />
        </div>
      )}
    </div>
  );
}
