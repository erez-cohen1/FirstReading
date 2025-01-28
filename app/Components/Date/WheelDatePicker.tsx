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
  const idxToStrMonth = (monthIndex: number) => {
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
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(new Date(Date.now())));
  const [curDate, setCurDate] = useState(date.getDate());
  const [curMonth, setCurMonth] = useState(idxToStrMonth(date.getMonth() + 1));
  const [curYear, setCurYear] = useState(date.getFullYear());
  const element = document.getElementById("top");

  const formatYear = (year: number) => {
    return new Date(Date.now()).getFullYear() - year;
  };
  const formatDay = (day: number) => {
    return day + 1;
  };
  const strMonthToIdx = (monthStr: string) => {
    const hebrewMonths: Record<string, number> = {
      ינואר: 1,
      פברואר: 2,
      מרץ: 3,
      אפריל: 4,
      מאי: 5,
      יוני: 6,
      יולי: 7,
      אוגוסט: 8,
      ספטמבר: 9,
      אוקטובר: 10,
      נובמבר: 11,
      דצמבר: 12,
    };
    // Validate the input
    if (!hebrewMonths[monthStr]) {
      throw new Error("Invalid month index. Please provide a number between 1 and 12.");
    }
    return hebrewMonths[monthStr];
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
            setValue={idxToStrMonth}
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
            const monthIndex = strMonthToIdx(curMonth) < 10 ? `0${strMonthToIdx(curMonth)}` : strMonthToIdx(curMonth);
            setDate(new Date(`${curYear}-${monthIndex}-${curDate}T05:10:00`));
            setShow(false);
            element?.scrollIntoView();
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
