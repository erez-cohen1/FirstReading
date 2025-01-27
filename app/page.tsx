"use client";
import Schedule from "./Components/Schedule/Schedule";
import Votes from "./Components/Votes";
import DateSelector from "./Components/Date/dateSelector";
import KnessetAttendance from "./Components/Attendence/KnessetAttendance";
import DateComponent from "./Components/Date/Date";
import LawSummary from "./Components/LawSummary";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState(new Date(Date.now()));
  // console.log(date.toISOString());
  return (
    <main className="main-page">
      <section className="main-header">
        <h1>
          קריאה <br />
          ראשונה
        </h1>
      </section>
      <section className="Date">
        <DateComponent date={date}></DateComponent>
        <DateSelector date={date} setDate={setDate}></DateSelector>
      </section>
      <hr />
      <KnessetAttendance date={date} />
      {/* <div className="hidden-div"></div> */}
      <Schedule date={date}></Schedule>
      <LawSummary queryId={1433}></LawSummary>
      {/* <LawCount></LawCount> */}
      <Votes date={date}></Votes>
    </main>
  );
}
