"use client";
import { Dispatch, SetStateAction, useState } from "react";
import WheelDatePicker from "./WheelDatePicker";

export default function DateSelector({ date, setDate }: { date: Date; setDate: Dispatch<SetStateAction<Date>> }) {
  const [showWheels, setShowWeels] = useState(false);

  const dateStrparsed = date.toISOString().split("T")[0];
  const maxDateAllowed = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()).toISOString().split("T")[0];
  const minDateAllowed = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate()).toISOString().split("T")[0];

  const today = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); // Subtract 1 day in milliseconds
  const dayBeforeYesterday = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Subtract 2 days in milliseconds

  return (
    <div className="date-selector-wrapper">
      <div className="dates-table-date-selector">
        <div className="date-selector-div">
          <button
            onClick={() => {
              setDate(today);
              setShowWeels(false);
            }}
            className={`date-selector${date.toDateString() == today.toDateString() && !showWheels ? " selected" : ""}`}
          >
            היום
          </button>
        </div>
        <div
          className={`date-vertical-line${
            date.toDateString() == today.toDateString() || date.toDateString() == yesterday.toDateString() ? " line-selected" : ""
          }`}
        ></div>
        <div className="date-selector-div">
          <button
            onClick={() => {
              setDate(yesterday);
              setShowWeels(false);
            }}
            className={`date-selector${date.toDateString() == yesterday.toDateString() && !showWheels ? " selected" : ""}`}
          >
            אתמול
          </button>
        </div>
        <div
          className={`date-vertical-line${
            date.toDateString() == yesterday.toDateString() || date.toDateString() == dayBeforeYesterday.toDateString()
              ? " line-selected"
              : ""
          }`}
        ></div>
        <div className="date-selector-div">
          <button
            onClick={() => {
              setDate(dayBeforeYesterday);
              setShowWeels(false);
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
      {showWheels && <WheelDatePicker date={date} setDate={setDate} setShow={setShowWeels}></WheelDatePicker>}
    </div>
  );
}
