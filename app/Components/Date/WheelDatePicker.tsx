import React, { Dispatch, SetStateAction } from "react";
import { format, subDays, getDaysInMonth } from "date-fns";
import Wheel from "./Wheel";
import { toJewishDate, formatJewishDateInHebrew } from "jewish-date";
import { useState } from "react";
// import "./styles.css";

export default function WheelDatePicker({
  date,
  setDate,
  setShow,
}: {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  setShow: Dispatch<SetStateAction<boolean>>;
}) {
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(new Date(Date.now())));
  const [curDate, setCurDate] = useState(date.getDate());
  const [curMonth, setCurMonth] = useState(date.getMonth());
  const [curYear, setCurYear] = useState(date.getFullYear());
  const formatYear = (year: number) => {
    return new Date(Date.now()).getFullYear() - year;
  };
  const formatDay = (day: number) => {
    return day + 1;
  };
  const formatMonth = (monthIndex: number) => {
    const hebrewMonths: Record<string, string> = {
      "1": "ינואר",
      "2": "פברואר",
      "3": "מרץ",
      "4": "אפריל",
      "5": "מאי",
      "6": "יוני",
      "7": "יולי",
      "8": "אוגוסט",
      "9": "ספטמבר",
      "10": "אוקטובר",
      "11": "נובמבר",
      "12": "דצמבר",
    };

    const shiftedMonthIndex = monthIndex + 1;
    // Convert the number to a string to match object keys
    const monthKey = shiftedMonthIndex.toString();

    // Validate the input
    if (!hebrewMonths[monthKey]) {
      throw new Error("Invalid month index. Please provide a number between 1 and 12.");
    }

    return hebrewMonths[monthKey];
  };
  return (
    <div className="wheel-date-picker-wrapper">
      <div className="wheel-date-picker-component">
        <div className="wheel-date-picker">
          <Wheel
            loop
            length={daysInMonth}
            perspective="center"
            initIdx={new Date(Date.now()).getDate() - 1}
            setValue={formatDay}
            setDate={setCurDate}
          />
        </div>
        <div className="wheel-date-picker">
          <Wheel
            loop
            length={12}
            perspective="center"
            initIdx={new Date(Date.now()).getMonth()}
            setValue={formatMonth}
            setDate={setCurMonth}
          />
        </div>
        <div className="wheel-date-picker">
          <Wheel length={2} initIdx={0} setValue={formatYear} setDate={setCurYear} />
        </div>
      </div>
      <div className="date-selector-buttons-wrapper">
        <button
          onClick={() => {
            console.log(new Date(Date.now()).getFullYear() - curYear, curMonth, curDate + 1);
            setDate(new Date(new Date(Date.now()).getFullYear() - curYear, curMonth, curDate + 1));
            setShow(false);
          }}
          className="date-selector-button"
        >
          בחר
        </button>
        <button
          onClick={() => {
            setShow(false);
          }}
          className="date-selector-button"
        >
          סגור
        </button>
      </div>
    </div>
  );
}
