"use client";
import Schedule from "./Components/Schedule/Schedule";
import VoteCount from "./Components/Votes";
import DateSelector from "./Components/dateSelector";
import KnessetAttendance from "./Components/attendence";
import CurrentDate from "./Components/Date";
import LawSummary from "./Components/LawSummary";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState(new Date(Date.now()));

  return (
    <main className="main-page">
      <section className="main-header">
        <h1>
          קריאה <br />
          ראשונה
        </h1>
      </section>
      <section className="Date">
        <CurrentDate></CurrentDate>
        <DateSelector date={date} setDate={setDate}></DateSelector>
      </section>
      <hr />
      <KnessetAttendance></KnessetAttendance>
      <Schedule date={date}></Schedule>
      <LawSummary queryId={1433}></LawSummary>
      {/* <LawCount></LawCount> */}
      <VoteCount></VoteCount>
    </main>
  );
}
