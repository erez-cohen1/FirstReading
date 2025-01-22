import { Dispatch, SetStateAction } from "react";

export default function DateSelector({ date, setDate }: { date: Date; setDate: Dispatch<SetStateAction<Date>> }) {
  const dateStrparsed = date.toISOString().split("T")[0];
  const maxDateAllowed = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()).toISOString().split("T")[0];
  const minDateAllowed = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate()).toISOString().split("T")[0];

  const today = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); // Subtract 1 day in milliseconds
  const dayBeforeYesterday = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Subtract 2 days in milliseconds

  return (
    <div className="dates-table-date-selector">
      <a
        href=""
        onClick={() => setDate(today)}
        className={`date-selector${date.toDateString() == today.toDateString() ? " selected" : ""}`}
      >
        <p>היום</p>
      </a>
      <div className="date-vertical-line"></div>
      <a
        href=""
        onClick={() => setDate(yesterday)}
        className={`date-selector${date.toDateString() == yesterday.toDateString() ? " selected" : ""}`}
      >
        <p>אתמול</p>
      </a>
      <div className="date-vertical-line"></div>
      <a
        href=""
        onClick={() => setDate(dayBeforeYesterday)}
        className={`date-selector${date.toDateString() == dayBeforeYesterday.toDateString() ? " selected" : ""}`}
      >
        <p>שלשום</p>
      </a>
      <div className="date-vertical-line"></div>
      <a href="">
        <p>תאריך אחר</p>
      </a>
    </div>
    // <div className="date-selectors">
    //   <button className="date-selector-today">היום</button>
    //   <input
    //     type="date"
    //     className="date-selector-other"
    //     defaultValue={dateStrparsed}
    //     max={maxDateAllowed}
    //     onChange={(date) => setDate(new Date(`${date.target.value}T10:00:01`))}
    //     min={minDateAllowed}
    //   />
    // </div>
  );
}
