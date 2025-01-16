"use client";
import Schedule from "./Components/Schedule";
import LawCount from "./Components/Laws";
import VoteCount from "./Components/Votes";
import DateSelector from "./Components/dateSelector";
import KnessetAttendance from "./Components/attendence";
import Image from "next/image";
import Timeline from "./Components/TimeLine";
import CurrentDate from "./Components/Date";
import LawSummary from "./Components/LawSummary";
import { useState } from "react";
// import { getKnessetData } from "./getKnessetData";

export default function Home() {
  const [date, setDate] = useState(new Date(Date.now()));

  return (
    <main className="main-page">
      <section className="main-header">
        <h1>
          קריאה <br />
          ראשונה
        </h1>
        <DateSelector date={date} setDate={setDate}></DateSelector>
      </section>
      <section className="Date">
        <CurrentDate></CurrentDate>
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
