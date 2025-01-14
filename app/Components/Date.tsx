"use client";

import { useState, useEffect } from "react";
import {
  toJewishDate,
  formatJewishDateInHebrew,
} from "jewish-date";

export default function HebrewDateComponent() {
  const [gregorianDateHebrew, setGregorianDateHebrew] = useState("");
  const [hebrewDate, setHebrewDate] = useState("");

  useEffect(() => {
    const updateDates = () => {
      const today = new Date();

      // Format Gregorian date in Hebrew
      const formattedGregorianDateHebrew = today.toLocaleDateString("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setGregorianDateHebrew(formattedGregorianDateHebrew);

      // Convert and format Hebrew date
      const jewishDate = toJewishDate(today);
      const formattedHebrewDate = formatJewishDateInHebrew(jewishDate);
      setHebrewDate(formattedHebrewDate);
    };

    updateDates(); // Initialize
    const interval = setInterval(updateDates, 86400000); // Update every 24 hours

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <>
      <p  className="Date-fig">
        <strong></strong> {gregorianDateHebrew}
      </p>
      <p  className="Date-fig">
        <strong></strong> {hebrewDate}
      </p>
    </>
  );
}
