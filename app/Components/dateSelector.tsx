import { Dispatch, SetStateAction } from "react";

export default function DateSelector({ date, setDate }: { date: Date; setDate: Dispatch<SetStateAction<Date>> }) {
  const dateStrparsed = date.toISOString().split("T")[0];
  const maxDateAllowed = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()).toISOString().split("T")[0];
  const minDateAllowed = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate()).toISOString().split("T")[0];
  return (
    <div className="date-selectors">
      <button className="date-selector-today">היום</button>
      <input
        type="date"
        className="date-selector-other"
        defaultValue={dateStrparsed}
        max={maxDateAllowed}
        onChange={(date) => setDate(new Date(`${date.target.value}T10:00:01`))}
        min={minDateAllowed}
      />
    </div>
  );
}
