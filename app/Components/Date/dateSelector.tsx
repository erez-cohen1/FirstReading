"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import WheelDatePicker from "./WheelDatePicker";

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

  // const dateStrparsed = date.toISOString().split("T")[0];
  // const maxDateAllowed = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()).toISOString().split("T")[0];
  // const minDateAllowed = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate()).toISOString().split("T")[0];
  useEffect(() => {
    if (showWheels) {
      document.documentElement.style.setProperty("--main-title-height-small", "9rem");
      // document.documentElement.style.setProperty("--main-title-height-big", "13.9rem");
    } else {
      document.documentElement.style.setProperty("--main-title-height-small", "2rem");
    }
  }, [showWheels]);
  const today = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); // Subtract 1 day in milliseconds
  const dayBeforeYesterday = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Subtract 2 days in milliseconds
  // const element = document.getElementById("top");

  return (
    <div className="date-selector-wrapper">
      <div className="dates-table-date-selector">
        <div className="date-selector-div">
          <button
            onClick={() => {
              setDate(today);
              setShowWeels(false);
              topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`date-selector${date.toDateString() == today.toDateString() && !showWheels ? " selected" : ""}`}
          >
            היום
          </button>
        </div>
        <div
          className={`date-vertical-line${
            date.toDateString() == today.toDateString() || (date.toDateString() == yesterday.toDateString() && !showWheels)
              ? " line-selected"
              : ""
          }`}
        ></div>
        <div className="date-selector-div">
          <button
            onClick={() => {
              setDate(yesterday);
              setShowWeels(false);
              topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`date-selector${date.toDateString() == yesterday.toDateString() && !showWheels ? " selected" : ""}`}
          >
            אתמול
          </button>
        </div>
        <div
          className={`date-vertical-line${
            date.toDateString() == yesterday.toDateString() ||
            (date.toDateString() == dayBeforeYesterday.toDateString() && !showWheels)
              ? " line-selected"
              : ""
          }`}
        ></div>
        <div className="date-selector-div">
          <button
            onClick={() => {
              setDate(dayBeforeYesterday);
              setShowWeels(false);
              topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`date-selector${
              date.toDateString() == dayBeforeYesterday.toDateString() && !showWheels ? " selected" : ""
            }`}
          >
            שלשום
          </button>
        </div>
        <div
          className={`date-vertical-line${
            date.toDateString() == dayBeforeYesterday.toDateString() || showWheels ? " line-selected" : ""
          }`}
        ></div>
        <div className="date-selector-div">
          <button onClick={() => setShowWeels(true)} className={`date-selector${showWheels ? " selected" : ""}`}>
            אחר
          </button>
        </div>
      </div>
      {showWheels && <WheelDatePicker date={date} setDate={setDate} setShow={setShowWeels} topRef={topRef}></WheelDatePicker>}
    </div>
  );
}
