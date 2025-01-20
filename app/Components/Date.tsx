"use client";

import { useState, useEffect } from "react";
import {
  toJewishDate,
  formatJewishDateInHebrew,
} from "jewish-date";

export default function HebrewDateComponent({ date }: { date: Date }) {
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
  }, [date]); // Re-run the effect whenever the `date` prop changes

  return (
    <>
      <p className="Date-fig">
        <strong></strong> {gregorianDateHebrew}
      </p>
      <p className="Date-fig">
        <strong></strong> {hebrewDate}
      </p>
    </>
  );
}
