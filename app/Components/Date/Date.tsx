"use client";

import { useState, useEffect } from "react";
import { toJewishDate, formatJewishDateInHebrew } from "jewish-date";

export default function DateComponent({ date }: { date: Date }) {
  const [gregorianDateHebrew, setGregorianDateHebrew] = useState("");
  const [hebrewDate, setHebrewDate] = useState("");

  useEffect(() => {
    // Format Gregorian date in Hebrew
    const formattedGregorianDateHebrew = date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setGregorianDateHebrew(formattedGregorianDateHebrew);

    // Convert and format Hebrew date
    const jewishDate = toJewishDate(date);
    const formattedHebrewDate = formatJewishDateInHebrew(jewishDate);
    setHebrewDate(formattedHebrewDate);

    // Add transition class to trigger animation
    const datesTableCurDate = document.querySelector(".dates-table-cur-date");
    if (datesTableCurDate) {
      datesTableCurDate.classList.add("transition");
      setTimeout(() => {
        datesTableCurDate.classList.remove("transition");
      }, 1000); // Duration of the transition
    }
  }, [date]); // Re-run the effect whenever the `date` prop changes

  return (
    <>
      <div className="dates-table-cur-date">
        <p className="date-content">{gregorianDateHebrew}</p>
        <p className="date-content">{hebrewDate}</p>
      </div>
    </>
  );
}

// add transition on date change
// add datepicker
